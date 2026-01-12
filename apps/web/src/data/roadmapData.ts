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
            id: 'feed-social',
            title: 'Feed de Actividad Global',
            description: 'Enterate cuando alguien agrega un nuevo vehículo a su colección. La base de nuestra comunidad.',
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
            id: 'follow-system',
            title: 'Seguir Coleccionistas',
            description: 'Seguí a tus amigos y personaliza tu inicio para ver solo las colecciones que elijas.',
            badge: '👥',
            statusLabel: 'PLANEADO',
            statusType: 'UPCOMING'
        },
        {
            id: 'likes-favs',
            title: 'Likes y Favoritos',
            description: 'Dale amor a los autos que más te gusten y ayuda a destacar lo mejor de la comunidad.',
            badge: '❤️',
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
            id: 'groups-events',
            title: 'Grupos y Eventos Temáticos',
            description: 'Herramientas para organizar juntas, grupos de marcas específicas y eventos locales.',
            badge: '🏁',
            statusLabel: 'IDEA',
            statusType: 'CONCEPT'
        }
    ]
};
