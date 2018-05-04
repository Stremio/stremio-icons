package com.stremio.icon;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.support.v7.widget.AppCompatImageView;
import android.util.AttributeSet;

public class IconView extends AppCompatImageView {

    private int mIconResourceId;
    private int mColor;

    public IconView(final Context context) {
        super(context);
        setScaleType(ScaleType.FIT_CENTER);
    }

    public IconView(final Context context, final AttributeSet attrs) {
        super(context, attrs);
        setScaleType(ScaleType.FIT_CENTER);
    }

    public IconView(final Context context, final AttributeSet attrs, final int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        setScaleType(ScaleType.FIT_CENTER);
    }

    public void setIcon(final String iconName) {
        mIconResourceId = getResourceIdByName(getContext(), iconName, "drawable");
        apply();
    }

    public void setColor(final String color) {
        mColor = Color.parseColor(color);
        apply();
    }

    private void apply() {
        try {
            setImageResource(mIconResourceId);
        } catch (final Exception e) {
        }

        try {
            getDrawable().mutate().setColorFilter(mColor, PorterDuff.Mode.MULTIPLY);
        } catch (final Exception e) {
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
