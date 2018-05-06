import Vue from 'vue';
import Router from 'vue-router';

import RoundList from '../components/RoundList';
import RoundEdit from '../components/RoundEdit';
import ParticipantList from '../components/ParticipantList';
import ParticipantEdit from '../components/ParticipantEdit';
import RoundParticipant from '../components/RoundParticipant';
import MatchList from '../components/MatchList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'round',
      component: RoundList
    },
    {
      path: '/round-edit/:id?',
      name: 'round-edit',
      component: RoundEdit
    },
    {
      path: '/participant',
      name: 'participant',
      component: ParticipantList
    },
    {
      path: '/participant-edit/:id?',
      name: 'participant-edit',
      component: ParticipantEdit
    },
    {
      path: '/round-participant/:id',
      name: 'round-participant',
      component: RoundParticipant
    },
    {
      path: '/match-list/:id',
      name: 'match-list',
      component: MatchList
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
