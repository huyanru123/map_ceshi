import React, { useState, useRef, useEffect } from 'react';
import { Map, APILoader, Marker } from '@uiw/react-amap';
import museumImg from './asset/ic_icbc.svg';
import icbcImg from './asset/icbc.jpg';
import icbcImg1 from './asset/2.jpg';
import icbcImg2 from './asset/3.jpg';

// 静态数据定义在组件外部，避免每次渲染重新创建
const points = [
  {
    id: 'museum',
    name: '工行北分行史馆',
    desc: '行史馆',
    position: [116.39888, 39.94416],
    img: icbcImg,
    icon: museumImg,
  },
  {
    id: 'gulou',
    name: '工行鼓楼支行',
    desc: '鼓楼支行',
    position: [116.391, 39.9417],
    img: icbcImg1,
    icon: museumImg,
  },
  {
    id: 'gugong',
    name: '工行北海支行',
    desc: '北海支行',
    position: [116.398, 39.93],
    img: icbcImg2,
    icon: museumImg,
  },
];

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const panelRef = useRef(null);

  // 触摸滑动相关
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const minSwipeDistance = 30;

  // 地图中心联动
  useEffect(() => {
    if (selectedIndex !== null && mapInstance) {
      mapInstance.setCenter(points[selectedIndex].position, true);
    }
  }, [selectedIndex, mapInstance]);

  // 处理标记点击
  const handleMarkerClick = (index) => {
    setSelectedIndex(index);
  };

  // 关闭面板
  const handleClose = () => {
    setSelectedIndex(null);
  };

  // 原生触摸事件处理（保持不变）
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const onTouchMove = (e) => {
      if (touchStartX.current === 0) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (selectedIndex === null) {
        touchStartX.current = 0;
        return;
      }
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          const newIndex = (selectedIndex - 1 + points.length) % points.length;
          setSelectedIndex(newIndex);
        } else {
          const newIndex = (selectedIndex + 1) % points.length;
          setSelectedIndex(newIndex);
        }
      }

      touchStartX.current = 0;
      touchStartY.current = 0;
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('touchend', onTouchEnd, { passive: true });
    panel.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
      panel.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [selectedIndex]);

  return (
    <APILoader akey="5f9a49a1f3f724139a51158d028d4ecb">
      <div style={{ position: 'relative', height: '100vh' }}>
        <Map
          style={{ height: '100%', width: '100%' }}
          zoom={14}
          center={selectedIndex !== null ? points[selectedIndex].position : [116.39888, 39.94416]}
          onCreate={setMapInstance}
        >
          {points.map((point, index) => {
            const isSelected = index === selectedIndex;
            const iconSize = isSelected ? [40, 40] : [30, 30];
            const icon = window.AMap
              ? new window.AMap.Icon({
                  size: iconSize,
                  image: point.icon,
                  imageSize: iconSize,
                })
              : point.icon;

            return (
              <React.Fragment key={point.id}>
                {/* 图片标记 */}
                <Marker
                  position={point.position}
                  icon={icon}
                  onClick={() => handleMarkerClick(index)}
                />
                {/* 文字标记 - 动态调整 margin-top */}
                <Marker
                  position={point.position}
                  content={`<div style="margin-top:${isSelected ? 45 : 35}px; margin-left:-20px; color:black; background:transparent; font-weight:bold; font-size:12px; white-space: nowrap; width: max-content;">${point.name}</div>`}
                  onClick={() => handleMarkerClick(index)}
                />
              </React.Fragment>
            );
          })}
        </Map>

        {/* 底部面板 - 始终显示左右预览面板 */}
        {selectedIndex !== null && (
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: 0,
              right: 0,
              height: '30%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              zIndex: 1000,
              pointerEvents: 'none', // 让父容器不拦截点击，子元素可接收
            }}
          >
            {/* 左侧预览面板（前一个点）- 始终显示 */}
            <div
              style={{
                width: '2%',
                height: '100%',
                backgroundColor: '#fff',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                borderTopLeftRadius: '12px',
                overflow: 'hidden',
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
                boxSizing: 'border-box',
                textAlign: 'right',
              }}
              onClick={() => setSelectedIndex((selectedIndex - 1 + points.length) % points.length)}
            >
              <img
                src={points[(selectedIndex - 1 + points.length) % points.length].img}
                alt={points[(selectedIndex - 1 + points.length) % points.length].name}
                style={{
                  width: '100%',
                  height: '40%',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <h4
                style={{
                  margin: '5px 0 2px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {points[(selectedIndex - 1 + points.length) % points.length].name}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '10px',
                  color: '#666',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {points[(selectedIndex - 1 + points.length) % points.length].desc}
              </p>
            </div>

            {/* 中间主面板（当前点）- 固定宽度66%，左右外边距2% */}
            <div
              ref={panelRef}
              style={{
                width: '90%',
                height: '100%',
                backgroundColor: '#fff',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                marginLeft: '2%',
                marginRight: '2%',
                pointerEvents: 'auto',
                touchAction: 'pan-y',
                display: 'flex',
                flexDirection: 'row',
                padding: '20px',
                boxSizing: 'border-box',
              }}
            >
              <img
                src={points[selectedIndex].img}
                alt={points[selectedIndex].name}
                style={{ width: '70px', height: '70px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ marginLeft: '20px', flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                  {points[selectedIndex].name}
                </h4>
                <p style={{ margin: '0 0 16px 0', color: '#666' }}>
                  {points[selectedIndex].desc}
                </p>
                <button
                  style={{
                    padding: '8px 16px',
                    marginRight: '20px',
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => alert(`分享 ${points[selectedIndex].name}`)}
                >
                  分享
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  关闭
                </button>
              </div>
            </div>

            {/* 右侧预览面板（后一个点）- 始终显示 */}
            <div
              style={{
                width: '2%',
                height: '100%',
                backgroundColor: '#fff',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                borderTopRightRadius: '12px',
                overflow: 'hidden',
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px',
                boxSizing: 'border-box',
                textAlign: 'left',
              }}
              onClick={() => setSelectedIndex((selectedIndex + 1) % points.length)}
            >
              <img
                src={points[(selectedIndex + 1) % points.length].img}
                alt={points[(selectedIndex + 1) % points.length].name}
                style={{
                  width: '100%',
                  height: '40%',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <h4
                style={{
                  margin: '5px 0 2px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {points[(selectedIndex + 1) % points.length].name}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '10px',
                  color: '#666',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {points[(selectedIndex + 1) % points.length].desc}
              </p>
            </div>
          </div>
        )}
      </div>
    </APILoader>
  );
};

export default App;