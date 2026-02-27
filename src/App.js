import React, { useState } from 'react';
import { Map, APILoader, Marker } from '@uiw/react-amap';
import museumImg from './asset/museum.png'
import icbcImg from './asset/icbc.jpg'
import icbcImg1 from './asset/2.jpg'

const App = () => {

  // 控制底部面板显示的状态
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelVisible1, setPanelVisible1] = useState(false);

  // 处理 Marker 点击
  const handleMarkerClick = () => {
    setPanelVisible1(false);

    setPanelVisible(prev => !prev);

  };

  // 关闭底部面板
  const handleClose = () => {
    setPanelVisible(false);
  };
  

  // 处理 Marker 点击
  const handleMarkerClick1 = () => {
    setPanelVisible(false);

    setPanelVisible1(prev => !prev);
  };

  // 关闭底部面板
  const handleClose1 = () => {
    setPanelVisible1(false);
  };


  return (
    <APILoader akey="5f9a49a1f3f724139a51158d028d4ecb">
      {/* 外层容器设置为相对定位，以便内部绝对定位面板 */}
      <div style={{ position: 'relative', height: '100vh' }}>
        <Map
          style={{ height: '100%', width: '100%' }}
          zoom={16}
          center={[116.39888, 39.94416]}
        >

          <Marker
            position={[116.39888, 39.94416]}
            icon={museumImg} // 使用正确配置的 icon
            // label={{    
            //   content: '<div style="color:red; background:transparent;border:None">工行北分行史馆</div>',
            //   direction: 'bottom',   
            //   offset: [0, 10], 
            // }}

            onClick={handleMarkerClick}
          />
          <Marker
            position={[116.39830, 39.9434]}
            content={'<div style="color:black; background:transparent;font-weight:bold;font-size:12px;white-space: nowrap; width: max-content;">工行北分行史馆</div>'} 
            onClick={handleMarkerClick}
          />
                 {/* 底部弹出面板 - 使用绝对定位固定在底部 */}
        {panelVisible && (
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              display:'flex',
              flexDirection:'row', 
              height:'250px',         
              left: '10px',
              right: '10px',
              backgroundColor: '#fff',
              padding: '20px',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              zIndex: 1000,
            }}
          >
             <img src={icbcImg} alt="工行北分行史馆" style={{width: '30%'}} />

            <div style={{
              
              margin:'0 30px',
              
            }}>
              <h4 style={{ margin: '0 0 8px 0',fontSize:'24px' }}>工行北分行史馆</h4>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>
              中国工商银行北京市分行行史馆是展示其发展历程与企业文化的重要窗口。展馆通过大量珍贵的老照片、账册、算盘及各个时期的金融实物，生动还原了从手工记账到数字化金融的巨大变迁。馆内通常分为历史沿革、业务成就、服务创新及党建引领等区域，不仅记录了该行支持首都经济建设的辉煌足迹，也体现了“工于至诚，行以致远”的价值理念。该馆主要面向员工及嘉宾开放，是进行内部教育及对外交流的平台。
            </p>
            {/* <img src={icbcImg} alt="工行鼓楼支行" style={{ width: '100%', maxWidth: '300px' }} /> */}
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
                cursor: 'pointer'
              }}
            >
              关闭
            </button>
            </div>

            
          </div>
        )}
        <Marker
            position={[116.391, 39.9417]}
            icon={museumImg} // 使用正确配置的 icon
            // label={{    
            //   content: '<div style="color:red; background:transparent;border:None">工行北分行史馆</div>',
            //   direction: 'bottom',   
            //   offset: [0, 10], 
            // }}

            onClick={handleMarkerClick1}
        />
        <Marker
            position={[116.3904, 39.94095]}
            content={'<div style="color:black; background:transparent;font-weight:bold;font-size:12px;white-space: nowrap; width: max-content;">工行鼓楼支行</div>'} 
            onClick={handleMarkerClick1}
        />
                 {/* 底部弹出面板 - 使用绝对定位固定在底部 */}
       {panelVisible1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              display:'flex',
              flexDirection:'row', 
              height:'250px',         
              left: '10px',
              right: '10px',
              backgroundColor: '#fff',
              padding: '20px',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              zIndex: 1000,
            }}
          >
             <img src={icbcImg1} alt="工行鼓楼支行" style={{width: '30%'}} />

            <div style={{
              
              margin:'0 30px',
              
            }}>
              <h4 style={{ margin: '0 0 8px 0',fontSize:'24px' }}>工行鼓楼支行</h4>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>
              中国工商银行北京鼓楼支行位于北京市西城区地安门外大街31号。该支行成立于2006年2月27日，是一家经批准成立的股份有限公司分公司。其经营范围涵盖了传统的本外币业务，包括办理人民币存款、贷款、结算，以及外汇存款、汇款、国际结算和结售汇等。如需办理业务，可拨打联系电话010-64051935或010-57970066进行咨询。
            </p>
            {/* <img src={icbcImg} alt="工行鼓楼支行" style={{ width: '100%', maxWidth: '300px' }} /> */}
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
            >
              分享
            </button>
            <button
              onClick={handleClose1}
              style={{
                
                padding: '8px 16px',
                backgroundColor: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              关闭
            </button>
            </div>

            
          </div>
        )}
        </Map>

 
      </div>
      
    </APILoader>
  );
};

export default App;