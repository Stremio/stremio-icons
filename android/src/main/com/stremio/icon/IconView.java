package com.stremio.icon;

import android.content.Context;
import android.graphics.PorterDuff;
import android.support.v4.widget.ImageViewCompat;
import android.support.v7.widget.AppCompatImageView;
import android.util.AttributeSet;

public class IconView extends AppCompatImageView {

    public IconView(final Context context) {
        super(context);
        init();
    }

    public IconView(final Context context, final AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public IconView(final Context context, final AttributeSet attrs, final int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        setScaleType(ScaleType.FIT_CENTER);
        ImageViewCompat.setImageTintMode(this, PorterDuff.Mode.DST_IN);
    }

}
