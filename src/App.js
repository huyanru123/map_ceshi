import React, { useState, useRef, useEffect } from 'react';
import { Map, APILoader, Marker } from '@uiw/react-amap';
import museumImg from './asset/museum.png';
import icbcImg from './asset/icbc.jpg';
import icbcImg1 from './asset/2.jpg';

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

        {/* 底部面板 - 未做任何修改 */}
        {selectedIndex !== null && (
          <div
            ref={panelRef}
            style={{
              position: 'absolute',
              bottom: '30px',
              display: 'flex',
              flexDirection: 'row',
              height: '20%',
              left: '10px',
              right: '10px',
              backgroundColor: '#fff',
              padding: '20px',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              zIndex: 1000,
              touchAction: 'pan-y',
            }}
          >
            <img
              src={points[selectedIndex].img}
              alt={points[selectedIndex].name}
              style={{ width: '70px', height: '70px', objectFit: 'cover' }}
            />
            <div style={{ margin: '0 30px', flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                {points[selectedIndex].name}
              </h4>
              <p style={{ margin: '0 0 16px 0', color: '#666' }}>
                {points[selectedIndex].desc}
              </p>
              <button
                style={{
                  padding: '8px 16px',
                  margin: '0 50px 0 0',
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
        )}
      </div>
    </APILoader>
  );
};

export default App;