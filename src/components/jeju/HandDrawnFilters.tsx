'use client';

/**
 * SVG 滤镜定义组件 —— 在页面顶部渲染一次即可
 * 使用方式：给任意元素加 style={{ filter: 'url(#sketchy)' }}
 *
 * 策略：只对边框/容器外形做轻微扭曲，scale 值要足够小
 * 以免影响内部文字清晰度。
 *
 * 提供 3 个滤镜：
 * - #sketchy        手绘边缘（轻微，适合卡片边框）
 * - #sketchy-strong  手绘边缘（稍强，仅用于装饰线条）
 * - #paper-texture   纸质纹理叠加
 */
export default function HandDrawnFilters() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <defs>
        {/* 轻微手绘扭曲 — 降低 scale 保证文字清晰 */}
        <filter id="sketchy" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* 较强手绘扭曲 — 仅用于纯装饰线条，不含文字 */}
        <filter id="sketchy-strong" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* 纸质纹理 */}
        <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="5" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray-noise" />
          <feBlend in="SourceGraphic" in2="gray-noise" mode="multiply" result="textured" />
          <feComponentTransfer in="textured">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
