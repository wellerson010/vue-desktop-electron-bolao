import Vue from 'vue';
import Router from 'vue-router';

import RoundList from '../components/RoundList';
import RoundEdit from '../components/RoundEdit';
import ParticipantList from '../components/ParticipantList';
import ParticipantEdit from '../components/ParticipantEdit';
import RoundParticipant from '../components/RoundParticipant';
import MatchList from '../components/MatchList';
import Ranking from '../components/Ranking';
import Backup from '../components/Backup';

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
      path: '/ranking/:id',
      name: 'ranking',
      component: Ranking
    },
    {
      path: '/backup',
      name: 'backup',
      component: Backup
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
