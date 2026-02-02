export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    badge: string; // Emoji
    statusLabel: string; // Visual tag text
    statusType: 'DEVELOPMENT' | 'UPCOMING' | 'CONCEPT';
}

export const roadmapData: {
    inDevelopment: RoadmapItem[];
    upcoming: RoadmapItem[];
    future: RoadmapItem[];
} = {
    inDevelopment: [
        {
            id: 'match-search',
            title: 'Matcheo de Búsquedas',
            description: 'Queremos que la comunidad se ayude. Si vos tenés o sabés dónde hay un auto que otro busca, se van a poder avisar',
            badge: '🔄',
            statusLabel: 'EN_CONSTRUCCION',
            statusType: 'DEVELOPMENT'
        },
        {
            id: 'badges-system',
            title: 'Insignias de Coleccionista',
            description: 'Queremos objetivos, gana placas como "Primer Auto", "Experto" o "Fundador" según distintos acontecimientos.',
            badge: '🎖️',
            statusLabel: 'EN_CONSTRUCCION',
            statusType: 'DEVELOPMENT'
        }
    ],
    upcoming: [
        {
            id: 'gallery-artist',
            title: 'Galeria artistica',
            description: 'Un espacio para mostrar tus autos de forma mas cuidada y profesional. Sección dedicada para imagenes artisticas de tu colección.',
            badge: '🎨',
            statusLabel: 'PLANEADO',
            statusType: 'UPCOMING'
        },
        {
            id: 'customs-section',
            title: 'Seccion para customs',
            description: 'Sabemos que el mundo custom es muy importante para la comunidad, por eso estamos planeando una sección para mostrar tus customs en un lugar dedicado.',
            badge: '🔧',
            statusLabel: 'PLANEADO',
            statusType: 'UPCOMING'
        },
        {
            id: 'highlight-users',
            title: 'Coleccionista del Mes',
            description: 'Espacio dedicado para destacar a los perfiles con las colecciones más impactantes.',
            badge: '🏆',
            statusLabel: 'PLANEADO',
            statusType: 'UPCOMING'
        }
    ],
    future: [
        {
            id: 'photo-contest',
            title: 'Concurso: Foto del Mes',
            description: 'Subí tu mejor fotografía artística y deja que la comunidad vote por la ganadora en el Hall of Fame.',
            badge: '📸',
            statusLabel: 'IDEA',
            statusType: 'CONCEPT'
        },
        {
            id: 'giveaways',
            title: 'Sorteos',
            description: 'Si tenemos la dicha de que la comunidad crezca, nos gustaria poder hacer sorteos propios de Wheels House para la comunidad.',
            badge: '🏁',
            statusLabel: 'IDEA',
            statusType: 'CONCEPT'
        }
    ]
};
