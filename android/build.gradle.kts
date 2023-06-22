group = "com.github.Stremio"
version = "5.0.0"

plugins {
    kotlin("multiplatform")
    id("maven-publish")
    id("com.android.library")
}

repositories {
    google()
    mavenCentral()
}

kotlin {
    android {
        publishLibraryVariants("release")
    }

    @Suppress("UNUSED_VARIABLE")
    sourceSets {
        val commonMain by getting
        val androidMain by getting
    }
}

android {
    defaultConfig {
        minSdk = 22
        compileSdk = 33
    }

    sourceSets {
        getByName("main") {
            manifest.srcFile("src/androidMain/AndroidManifest.xml")
        }
    }
}
