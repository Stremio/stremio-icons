package com.stremio.icon;

import android.graphics.Color;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.stremio.utils.StremioUtils;

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
            final int iconResourceId = StremioUtils.getResourceIdByName(icon, "drawable");
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

}
