import React, { useEffect, useState } from 'react';

const Settings = () => {
    const [opacity, setOpacity] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // In a real app, you might request initial state from main process
    }, []);

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setOpacity(value);
        window.ipcRenderer.send('update-settings', { type: 'opacity', value });
    };

    const handleMuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        setIsMuted(value);
        window.ipcRenderer.send('update-settings', { type: 'mute', value });
    };

    return (
        <div style={{
            padding: '20px',
            color: '#ecf0f1',
            background: '#2c3e50',
            height: '100vh',
            boxSizing: 'border-box',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ margin: '0 0 20px 0', borderBottom: '1px solid #34495e', paddingBottom: '10px' }}>设置</h2>

            <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    透明度: {Math.round(opacity * 100)}%
                </label>
                <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={handleOpacityChange}
                    style={{ width: '100%', cursor: 'pointer' }}
                />
            </div>

            <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={isMuted}
                        onChange={handleMuteChange}
                        style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ fontWeight: 'bold' }}>静音模式</span>
                </label>
            </div>

            <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '40px' }}>
                修改将实时应用到角色窗口。
            </p>
        </div>
    );
};

export default Settings;