interface BossProps {
    isBruised?: boolean;
}

const BossCharacter = ({ isBruised }: BossProps) => {
    return (
        <svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))',
                cursor: 'pointer',
            }}
        >
            {/* 飞踢面部表情 */}
            {
                isBruised ?
                    <defs>
                        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#000" />
                            <stop offset="100%" stopColor="#f11f08ff" />
                        </linearGradient>
                    </defs>
                    :
                    <defs>
                        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f1c27d" />
                            <stop offset="100%" stopColor="#e0b16c" />
                        </linearGradient>
                    </defs>

            }

            {/* 连体衣/套装 */}
            <path d="M40 180 C40 130, 160 130, 160 180 L160 210 L40 210 Z" fill="#2c3e50" />

            {/* 衬衫领 */}
            <path d="M75 180 L100 205 L125 180 L100 160 Z" fill="white" />

            {/* 领带 */}
            <path d="M100 160 L115 200 L100 215 L85 200 Z" fill="#c0392b" />

            {/* 耳朵 */}
            <circle cx="40" cy="95" r="16" fill="#e0b16c" />
            <circle cx="160" cy="95" r="16" fill="#e0b16c" />

            {/* 头 */}
            <circle cx="100" cy="90" r="65" fill="url(#skinGradient)" />

            {/* 瘀伤和伤口（绘制在皮肤表面，眼镜下方） */}
            {isBruised && (
                <>
                    {/* Black eye (Left) */}
                    <circle cx="75" cy="85" r="18" fill="#8e44ad" opacity="0.3" />

                    {/* Scratch on forehead */}
                    <path d="M110 50 L130 55" stroke="#c0392b" strokeWidth="2" opacity="0.7" />
                    <path d="M115 48 L125 57" stroke="#c0392b" strokeWidth="2" opacity="0.7" />

                    {/* Bandage on cheek */}
                    <g transform="rotate(-15 140 110)">
                        <rect x="130" y="105" width="20" height="10" rx="2" fill="#e6cba5" stroke="#d4ac7d" strokeWidth="1" />
                        <circle cx="140" cy="110" r="1.5" fill="#d4ac7d" />
                    </g>

                    {/* Swollen cheek */}
                    <circle cx="50" cy="110" r="10" fill="#e74c3c" opacity="0.2" />
                </>
            )}

            {/* 头发（秃顶/普通） */}
            <path d="M35 90 Q35 20 100 20 Q165 20 165 90" fill="none" stroke="#2c3e50" strokeWidth="12" strokeLinecap="round" />
            {/* 鬓角*/}
            <path d="M35 85 L35 105" stroke="#2c3e50" strokeWidth="8" strokeLinecap="round" />
            <path d="M165 85 L165 105" stroke="#2c3e50" strokeWidth="8" strokeLinecap="round" />

            {/* 眼睛 */}
            <circle cx="75" cy="85" r="6" fill="#2c3e50" />
            <circle cx="125" cy="85" r="6" fill="#2c3e50" />

            {/* 眼镜 */}
            <circle cx="75" cy="85" r="20" fill="rgba(255, 255, 255, 0.1)" stroke="#34495e" strokeWidth="3" />
            <circle cx="125" cy="85" r="20" fill="rgba(255, 255, 255, 0.1)" stroke="#34495e" strokeWidth="3" />
            <line x1="95" y1="85" x2="105" y2="85" stroke="#34495e" strokeWidth="3" />

            {/* 眉毛（生气/严肃） */}
            <line x1="55" y1="65" x2="85" y2="72" stroke="#2c3e50" strokeWidth="5" strokeLinecap="round" />
            <line x1="145" y1="65" x2="115" y2="72" stroke="#2c3e50" strokeWidth="5" strokeLinecap="round" />

            {/* 嘴部表情（生气 -> 悲伤/受伤） */}
            {isBruised ? (
                <path d="M85 135 Q100 125 115 135" fill="none" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
            ) : (
                <path d="M80 130 Q100 120 120 130" fill="none" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
            )}

            {/* 汗滴（可选，营造“压力感”） */}
            <path d="M150 50 Q150 45 153 45 Q156 45 156 50 Q156 60 153 60 Q150 60 150 50" fill="#3498db" opacity="0.6" />
        </svg>
    );
};

export default BossCharacter;