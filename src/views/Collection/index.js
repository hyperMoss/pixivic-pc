/*
 * @Author: gooing
 * @since: 2020-05-27 22:02:47
 * @lastTime: 2020-05-29 22:04:09
 * @LastAuthor: gooing
 * @FilePath: \pixiciv-pc\src\views\Collection\index.js
 * @message:
 */

import Mycollection from './MyCollection/index.vue';
import CollectionsIllust from './CollectionIllust/index.vue';

export default [
  {
    path: '/collect/mycollection',
    name: 'MyCollection',
    component: Mycollection
  },
  {
    path: '/collect/collectionsillust/:collectionId',
    name: 'CollectionsIllust',
    component: CollectionsIllust,
    props: true
  }
];
