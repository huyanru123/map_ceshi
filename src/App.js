import React, { useState, useRef, useEffect } from 'react';
import { Map, APILoader, Marker } from '@uiw/react-amap';
import museumImg from './asset/museum.png';
import icbcImg from './asset/icbc.jpg';
import icbcImg1 from './asset/2.jpg';

const App = () => {
  // 定义地图上所有兴趣点数据
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

  // 当前选中的点索引，null 表示面板关闭
  const [selectedIndex, setSelectedIndex] = useState(null);

  // 保存地图实例
  const [mapInstance, setMapInstance] = useState(null);

  // 触摸滑动相关 refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const minSwipeDistance = 30; // 最小滑动距离阈值

  // 当选中索引变化时，将地图中心移动到对应点
  useEffect(() => {
    if (selectedIndex !== null && mapInstance) {
      mapInstance.setCenter(points[selectedIndex].position);
    }
  }, [selectedIndex, mapInstance, points]);

  // 处理标记点击
  const handleMarkerClick = (index) => {
    setSelectedIndex(index);
  };

  // 关闭面板
  const handleClose = () => {
    setSelectedIndex(null);
  };

  // 触摸事件处理：实现左右滑动切换
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchMove = (e) => {
    // 如果主要是水平滑动，尝试阻止页面滚动
    if (touchStartX.current !== 0) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault(); // 注意：在部分浏览器中需要设置 passive: false 才有效
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (selectedIndex === null) return; // 面板未打开时不处理

    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // 确保是水平滑动且超过阈值
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // 向右滑动 -> 上一个点 (索引减1)
        const newIndex = (selectedIndex - 1 + points.length) % points.length;
        setSelectedIndex(newIndex);
      } else {
        // 向左滑动 -> 下一个点 (索引加1)
        const newIndex = (selectedIndex + 1) % points.length;
        setSelectedIndex(newIndex);
      }
    }

    // 重置
    touchStartX.current = 0;
    touchStartY.current = 0;
  };

  return (
    <APILoader akey="5f9a49a1f3f724139a51158d028d4ecb">
      <div style={{ position: 'relative', height: '100vh' }}>
        <Map
          style={{ height: '100%', width: '100%' }}
          zoom={14}
          center={[116.39888, 39.94416]} // 默认中心
          onCreate={setMapInstance}       // 获取地图实例
        >
          {/* 动态生成所有点的标记：图标 + 文字 */}
          {points.map((point, index) => (
            <React.Fragment key={point.id}>
              {/* 图标 Marker */}
              <Marker
                position={point.position}
                icon={point.icon}
                onClick={() => handleMarkerClick(index)}
              />
              {/* 文字 Marker（自定义 div 样式） */}
              <Marker
                position={point.position}
                content={`<div style="margin-top:30px;margin-left:-20px;color:black; background:transparent;font-weight:bold;font-size:12px;white-space: nowrap; width: max-content;">${point.name}</div>`}
                onClick={() => handleMarkerClick(index)}
              />
            </React.Fragment>
          ))}
        </Map>

        {/* 统一底部面板：当 selectedIndex 不为 null 时显示 */}
        {selectedIndex !== null && (
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
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
              touchAction: 'pan-y', // 允许垂直滚动，减少水平滚动干扰
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={points[selectedIndex].img}
              alt={points[selectedIndex].name}
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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