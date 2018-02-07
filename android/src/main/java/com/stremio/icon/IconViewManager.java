package com.stremio.icon;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.util.Log;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

final class IconViewManager extends SimpleViewManager<IconView> {

    private static final String REACT_CLASS = "RCT" + IconView.class.getSimpleName();
    private static final String ICON_PROP = "icon";
    private static final String COLOR_PROP = "color";
    private static final String SCALE_TYPE_PROP = "scaleType";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected IconView createViewInstance(final ThemedReactContext themedReactContext) {
        return new IconView(themedReactContext);
    }

    @Override
    public Map<String, Object> getExportedViewConstants() {
        final Map<String, Object> constants = MapBuilder.newHashMap();
        final IconView.ScaleType[] scaleTypes = IconView.ScaleType.values();
        for (IconView.ScaleType type : scaleTypes) {
            final String typeName = type.name();
            constants.put(typeName, typeName);
        }
        
        return constants;
    }

    @ReactProp(name = ICON_PROP)
    public void setIcon(final IconView iconView, final String icon) {
        try {
            final Context context = iconView.getContext();
            final int iconResourceId = getResourceIdByName(context, icon, "drawable");
            iconView.setImageResource(iconResourceId);
        } catch (final Exception e) {
            Log.e(REACT_CLASS, icon, e);
        }
    }

    @ReactProp(name = COLOR_PROP)
    public void setColor(final IconView iconView, final String color) {
        try {
            iconView.setColorFilter(Color.parseColor(color));
        } catch (final Exception e) {
            Log.e(REACT_CLASS, color, e);
        }
    }

    @ReactProp(name = SCALE_TYPE_PROP)
    public void setScaleType(final IconView iconView, final String scaleType) {
        try {
            iconView.setScaleType(IconView.ScaleType.valueOf(scaleType));
        } catch (final Exception e) {
            Log.e(REACT_CLASS, scaleType, e);
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
