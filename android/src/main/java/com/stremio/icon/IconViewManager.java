package com.stremio.icon;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

final class IconViewManager extends SimpleViewManager<IconView> {

    private static final String REACT_CLASS = "RCT" + IconView.class.getSimpleName();
    private static final String ICON_PROP = "icon";
    private static final String COLOR_PROP = "color";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected IconView createViewInstance(final ThemedReactContext themedReactContext) {
        return new IconView(themedReactContext);
    }

    @ReactProp(name = ICON_PROP)
    public void setIcon(final IconView iconView, final String icon) {
        try {
            final Context context = iconView.getContext();
            final int iconResourceId = getResourceIdByName(context, icon, "drawable");
            iconView.setImageResource(iconResourceId);
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }

    @ReactProp(name = COLOR_PROP)
    public void setColor(final IconView iconView, final String color) {
        try {
            iconView.setColorFilter(Color.parseColor(color));
        } catch (final Exception e) {
            e.printStackTrace();
        }
    }

    private static int getResourceIdByName(final Context context, final String resourceName, final String resourceType) {
        final Context application = context.getApplicationContext();
        final Resources resources = application.getResources();
        final String packageName = application.getPackageName();
        final int resourceId = resources.getIdentifier(resourceName, resourceType, packageName);
        return resourceId;
    }


}
