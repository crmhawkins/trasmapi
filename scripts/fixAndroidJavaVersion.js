import fs from 'fs';
import path from 'path';

const androidBuildGradlePath = path.join('android', 'app', 'build.gradle');

try {
    let buildGradle = fs.readFileSync(androidBuildGradlePath, 'utf8');

    // Forzar Java 17
    buildGradle = buildGradle.replace(/sourceCompatibility JavaVersion.VERSION_\d+/g, 'sourceCompatibility JavaVersion.VERSION_17');
    buildGradle = buildGradle.replace(/targetCompatibility JavaVersion.VERSION_\d+/g, 'targetCompatibility JavaVersion.VERSION_17');

    // También opcionalmente arreglar kotlinOptions si quieres
    buildGradle = buildGradle.replace(/jvmTarget = "\d+"/g, 'jvmTarget = "17"');

    fs.writeFileSync(androidBuildGradlePath, buildGradle);
    console.log('✅ Java 17 configurado automáticamente en android/app/build.gradle');
} catch (error) {
    console.error('❌ Error modificando build.gradle', error);
}
