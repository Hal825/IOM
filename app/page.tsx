import type { Metadata } from 'next';
import { Workbench } from './components/workbench';

export const metadata: Metadata = {
  title: 'OpenMontage — 文本生成视频',
  description: '输入文本，自动完成调研、脚本、素材与逐镜头视频生成',
};

/** 首页：服务端壳，交互全部由客户端 <Workbench /> 承担。 */
export default function HomePage() {
  return <Workbench />;
}
