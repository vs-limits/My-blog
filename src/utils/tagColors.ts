// 暖色调标签调色板，完美适配 #FAF7EE 暖黄纸质背景
export const TAG_PALETTES = [
  {
    bg: 'bg-[#E5ECE3]',
    text: 'text-[#2D4D32]',
    border: 'border-[#C6DAC4]',
    hover: 'hover:bg-[#D7E3D4]',
  },
  {
    bg: 'bg-[#F9ECE6]',
    text: 'text-[#8E3B27]',
    border: 'border-[#ECC7BE]',
    hover: 'hover:bg-[#F2DFD7]',
  },
  {
    bg: 'bg-[#F8EED7]',
    text: 'text-[#865B13]',
    border: 'border-[#E7D6AE]',
    hover: 'hover:bg-[#EFE2C5]',
  },
  {
    bg: 'bg-[#E4EDF5]',
    text: 'text-[#295175]',
    border: 'border-[#C7D9EA]',
    hover: 'hover:bg-[#D5E3F0]',
  },
  {
    bg: 'bg-[#EFE7F3]',
    text: 'text-[#623A6E]',
    border: 'border-[#D9C7E1]',
    hover: 'hover:bg-[#E3D6EA]',
  },
  {
    bg: 'bg-[#EBEDE0]',
    text: 'text-[#4E532B]',
    border: 'border-[#D0D3BE]',
    hover: 'hover:bg-[#DFE2CE]',
  },
  {
    bg: 'bg-[#F6E8EC]',
    text: 'text-[#7D354E]',
    border: 'border-[#E6C6D2]',
    hover: 'hover:bg-[#EED7E0]',
  },
  {
    bg: 'bg-[#E2EFEF]',
    text: 'text-[#255456]',
    border: 'border-[#BDDCDC]',
    hover: 'hover:bg-[#D1E5E5]',
  },
];

/**
 * 根据标签名称生成确定性的色彩配置，保证同一标签在所有页面颜色统一
 */
export function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_PALETTES.length;
  return TAG_PALETTES[index];
}
