group = "com.github.Stremio"
version = "5.0.0"

buildscript {
    repositories {
        gradlePluginPortal()
    }

    dependencies {
        classpath("dev.icerock.moko:resources-generator:0.23.0")
    }
}

plugins {
    kotlin("multiplatform")
    id("maven-publish")
    id("com.android.library")
    id("dev.icerock.mobile.multiplatform-resources")
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
        val commonMain by getting {
            dependencies {
                api("dev.icerock.moko:resources:${extra["moko.version"] as String}")
            }
        }
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

multiplatformResources {
    multiplatformResourcesPackage = "com.stremio.icon"
}
