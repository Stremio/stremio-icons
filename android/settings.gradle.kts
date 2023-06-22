pluginManagement {
    repositories {
        google()
        gradlePluginPortal()
        mavenCentral()
        maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    }

    plugins {
        kotlin("multiplatform").version(extra["kotlin.version"] as String)
        id("com.android.library").version(extra["agp.version"] as String)
        id("dev.icerock.mobile.multiplatform-resources").version(extra["moko.version"] as String)
    }
}
