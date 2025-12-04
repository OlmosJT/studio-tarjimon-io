import { computed } from 'vue';
import {type Project, projectService} from '~/services/projectService';

export const useProjects = () => {
    const { data: projects, pending, error, refresh } = useAsyncData<Project[]>('projects-list', () => {
        return projectService.getProjects();
    });

    const activeProjects = computed(() =>
        projects.value?.filter(p => p.status === 'ONGOING') || []
    );

    const completedProjects = computed(() =>
        projects.value?.filter(p => p.status === 'COMPLETED') || []
    );

    const otherProjects = computed(() =>
        projects.value?.filter(p => !['ONGOING', 'COMPLETED'].includes(p.status)) || []
    );

    const MAX_PROJECTS = 3;
    const activeCount = computed(() => activeProjects.value.length);
    const isLimitReached = computed(() => activeCount.value >= MAX_PROJECTS);

    return {
        // State
        projects,
        pending,
        error,
        refresh,

        // Computed Lists
        activeProjects,
        completedProjects,
        otherProjects,

        // Limits
        MAX_PROJECTS,
        activeCount,
        isLimitReached
    };
};