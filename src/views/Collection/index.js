
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
