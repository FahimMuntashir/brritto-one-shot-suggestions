import { useState, useEffect } from 'react';
import type { Subject, Group } from '../types';

interface DataState {
  subjects: Subject[];
  groups: Group[];
  groupLabels: Record<string, string>;
  loading: boolean;
}

export function useData(): DataState {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch('/data/subjects.json').then(r => r.json()),
      fetch('/data/groups.json').then(r => r.json()),
    ]).then(([subjectsRes, groupsRes]) => {
      if (subjectsRes.status === 'fulfilled') setSubjects(subjectsRes.value);
      if (groupsRes.status === 'fulfilled') setGroups(groupsRes.value);
      setLoading(false);
    });
  }, []);

  const groupLabels = Object.fromEntries(groups.map(g => [g.key, g.label]));

  return { subjects, groups, groupLabels, loading };
}
