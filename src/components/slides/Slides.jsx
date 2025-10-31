// Central slide forwarder. Re-exports individual slide components from their folders.
import Concessions from './Concessions/Concessions';
import KCCStandings from './KnoxCountyCup/KCCStandings';
import KCCSchedule from './KnoxCountyCup/KCCSchedule';

export { Concessions, KCCStandings, KCCSchedule };

// Provide named default-like exports for convenience if needed elsewhere
export default {
  Concessions,
  KCCStandings,
  KCCSchedule
};

