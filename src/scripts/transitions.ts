// ページ切替アニメーション: 縦軸で裏返す flipX（旧ページが -90° まで回って消え、新ページが +90° から回って現れる）
import type { TransitionDirectionalAnimations } from 'astro';
const out = { name: 'flipOutX', duration: '0.32s', easing: 'cubic-bezier(.55,0,1,.45)', fillMode: 'forwards' as const };
const inn = { name: 'flipInX', duration: '0.32s', easing: 'cubic-bezier(0,.55,.45,1)', fillMode: 'backwards' as const, delay: '0.32s' };
export const flipX: TransitionDirectionalAnimations = { forwards: { old: out, new: inn }, backwards: { old: out, new: inn } };
