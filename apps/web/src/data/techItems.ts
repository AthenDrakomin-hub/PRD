import { traeSoloTechItems } from './categories/ai-dev-tools/trae-solo';
import { TechItem } from '../types';

// 静态数据被自动生成的数据合并/替换
import { generatedTechItems } from './techItems.generated';

export type { TechItem }; // 兼容原有导出

// 为了防止数据丢失，我们可以将原有的写死数据（如果有的话）与新生成的结合
// 或者按照用户的意图直接替换为生成的：
export const techItems: TechItem[] = [...generatedTechItems, ...traeSoloTechItems];
