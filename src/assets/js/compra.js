import { NativePurchases } from '@capgo/native-purchases';

export async function initializePurchases() {
  await NativePurchases.setup({
    apiKey: '', // Solo obligatorio si usas RevenueCat, ignóralo si no
    appUserID: null,
    observerMode: false,
    useAmazon: false,
  });
}

export async function quitarAnuncios() {
  try {
    const res = await NativePurchases.purchaseProduct({
      productId: 'remove_ads', // ID exacto en App Store o Google Play
      type: 'INAPP', // "INAPP" para compra única (no suscripción)
    });

    if (res?.customerInfo?.activeSubscriptions?.length > 0 || res?.customerInfo?.entitlements?.active?.remove_ads) {
      console.log('✅ Compra exitosa');
      localStorage.setItem('ads_removed', 'true');

      // Aquí tu llamada al backend
      await fetch('https://trasmapiback.hawkins.es/api/ads/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          purchaseId: res.customerInfo.originalAppUserId,
        }),
      });
      localStorage.setItem('ads_removed', 1);

      return true;
    } else {
      console.log('❌ Compra cancelada o no activa');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en la compra:', error);
    return false;
  }
}

  export async function restaurarCompras() {
    try {
      const res = await NativePurchases.restorePurchases();
  
      if (res?.customerInfo?.entitlements?.active?.remove_ads) {
        console.log('✅ Compra restaurada correctamente');
        localStorage.setItem('ads_removed', 'true');
        return true;
      } else {
        console.log('⚠️ No hay compras activas');
        return false;
      }
    } catch (error) {
      console.error('❌ Error restaurando compras:', error);
      return false;
    }
  }
  
