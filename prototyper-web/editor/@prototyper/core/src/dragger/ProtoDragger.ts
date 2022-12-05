import { ComponentDescriptor, DefaultPropsType } from '../component';

/**
 * 封装了一个拖拽器的定义。
 *
 * ## draggerProps类目配置
 *
 * 该项用于描述拖拽器展示在拖拽组件库的位置。仅仅只是一个规范，具体的呈现方式需要editor自行设计。
 *
 * ```ts
 * {
 *    draggerProps: {
 *      // 类别（一级目录）
 *      category?: string,
 *      // 子类别（二级目录）
 *      subcategory?: string,
 *      // 同级别内的排序（越大越靠前，默认为0）
 *      order?: number,
 *    }
 * }
 * ```
 *
 * ## draggerProps特殊配置
 *
 * ### type='native'
 *
 * 这种方式完全由用户指定拖拽器的渲染方式，需要指定拖拽器渲染组件。
 *
 * ```ts
 * {
 *    type: 'native',
 *    draggerProps: {
 *      renderer: React.ElementType
 *    }
 * }
 * ```
 *
 * ### type='img'
 *
 * 展示一张图片，需要指定图片路径和标题
 *
 * ```ts
 * {
 *    type: 'img',
 *    draggerProps: {
 *      src: '/public/img/button.png'
 *    }
 * }
 * ```
 *
 */
export interface ProtoDragger {
  type: 'native' | 'img' | string;
  label: string;

  draggerProps?: DefaultPropsType;

  /**
   * 拖拽产生的原型对象
   */
  descriptor: ComponentDescriptor;
  /**
   * 原型对象的默认props
   */
  compProps?: DefaultPropsType;
  /**
   * 是否将原型对象置为canvas。
   *
   * 如果设置为true，组件将被包裹为一个CanvasElement。
   */
  canvas?: boolean;
}
