// ページ切替アニメーション: slideUp（旧ページは薄れながら少し上へ、新ページは下から上へ滑り込む）
import type { TransitionDirectionalAnimations } from 'astro';
const out = { name: 'slideOutUp', duration: '0.3s', easing: 'cubic-bezier(.4,0,1,1)', fillMode: 'forwards' as const };
const inn = { name: 'slideInUp', duration: '0.42s', easing: 'cubic-bezier(.2,.8,.2,1)', fillMode: 'backwards' as const };
export const slideUp: TransitionDirectionalAnimations = { forwards: { old: out, new: inn }, backwards: { old: out, new: inn } };
