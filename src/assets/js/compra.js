import 'cordova-plugin-purchase';
import { Capacitor } from '@capacitor/core';
import { loginWithGoogle } from './auth.js';

const store = CdvPurchase.store;
const { Platform, ProductType, LogLevel } = CdvPurchase;

//Añadir en el arr todos los productos ACTIVOS de la Play Console
const PRODUCTS = [
  {
    id: 'remove_ads',
    platform: Capacitor.getPlatform() === 'android' ? Platform.GOOGLE_PLAY : Platform.APPLE_APPSTORE,
    type: ProductType.NON_CONSUMABLE
  }
];

// Acciones personalizadas por producto
const PRODUCT_ACTIONS = {
  remove_ads: () => {
    localStorage.setItem('ads_removed', 'true');
    const btn = document.getElementById('removeAdsBtn');
    if (btn) btn.style.display = 'none';
  }
};

export async function initializePurchases() {
  store.verbosity = LogLevel.DEBUG;

  try {
    store.register(PRODUCTS);

    store.when()
      .productUpdated(async product => {
        console.log('🛒 Producto actualizado:', product);

        if (product.owned) {
          // Acción personalizada si existe
          PRODUCT_ACTIONS[product.id]?.();

          // Iniciar sesión si no hay token
          let token = localStorage.getItem('token');
          if (!token) {
            console.log('🔐 Producto comprado pero sin sesión. Iniciando sesión...');
            const success = await loginWithGoogle();
            if (!success) {
              console.warn('⚠️ No se pudo iniciar sesión automáticamente.');
              return;
            }
            token = localStorage.getItem('token');
             // ✅ Mostrar botón de logout
            if (typeof window.toggleLoginLogoutButtons === 'function') {
              window.toggleLoginLogoutButtons(true);
            }
          }

          // Notificar al backend (dummy ID si ya estaba comprado)
          fetch('https://trasmapiback.hawkins.es/api/ads/purchase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({
              purchaseId: 'already_owned',
              productId: product.id
            }),
          });
        }
      })

      .approved(transaction => {
        console.log('🧾 Transacción aprobada:', transaction);
        transaction.verify();
      })

      .verified(receipt => {
        console.log('✅ Compra verificada:', receipt);
        receipt.finish();

        // Acción personalizada
        PRODUCT_ACTIONS[receipt.productId]?.();

        // Notificar al backend
        fetch('https://trasmapiback.hawkins.es/api/ads/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({
            purchaseId: receipt.purchaseId,
            productId: receipt.productId
          }),
        });
      });

    await store.initialize([{ platform: PRODUCTS[0].platform }]);

    store.error(err => {
      console.error('❌ Error global de la tienda:', err);
    });

    console.log('✅ Tienda inicializada correctamente');
  } catch (err) {
    console.error('❌ Error en la inicialización de la tienda:', err);
  }
}

export async function quitarAnuncios() {
  const product = store.get('remove_ads');

  if (!localStorage.getItem('token')) {
    console.log('🔐 Usuario no autenticado, iniciando sesión...');
    const success = await loginWithGoogle();
    if (!success) {
      console.error('❌ Inicio de sesión cancelado o fallido');
      return false;
    }

    if (typeof window.toggleLoginLogoutButtons === 'function') {
      window.toggleLoginLogoutButtons(true);
    }
  }

  if (!product) {
    console.error('❌ Producto no encontrado');
    return false;
  }

  if (product.owned) {
    PRODUCT_ACTIONS[product.id]?.();
    const btn = document.getElementById('removeAdsBtn');
    if (btn) btn.style.display = 'none';
    showAlert('Ya tienes comprados los anuncios.', 'info');
    return true;
  }

  const offer = product.getOffer();
  if (!offer) {
    console.error('❌ Oferta no disponible aún');
    return false;
  }

  const error = await offer.order();
  if (error) {
    console.error('❌ Error al comprar:', error);
    showAlert('Error al comprar: ' + error.message, 'error');
    return false;
  }

  // Compra iniciada exitosamente
  const btn = document.getElementById('removeAdsBtn');
  if (btn) btn.style.display = 'none';

    return true;
}

export function restaurarCompras() {
  store.refresh();
}
