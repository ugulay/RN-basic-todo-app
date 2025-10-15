package com.basicnotes

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          // add(ReactNativePushNotificationPackage()) // Added PushNotificationPackage
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    // Create notification channel for Android O and above
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    //   val channel = NotificationChannel("default_channel_id", "Default Channel", NotificationManager.IMPORTANCE_HIGH)
    //   val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    //   notificationManager.createNotificationChannel(channel)
    // }
  }
}
