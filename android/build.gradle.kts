plugins {
    id("com.android.library") version "8.13.0"
    id("org.jetbrains.kotlin.android") version "1.9.0"
    id("maven-publish")
}

android {
    namespace = "com.stremio.icons"
    compileSdk = 36

    defaultConfig {
        minSdk = 22
    }

    java {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

afterEvaluate {
    publishing {
        publications {
            create<MavenPublication>("release") {
                from(components["release"])

                groupId = "com.github.Stremio"
                artifactId = "stremio-icons"
                version = "5.9.0"
            }
        }
    }
}
