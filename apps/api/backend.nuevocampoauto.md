Guía de Integración para Frontend - Nuevos Atributos de Auto
Este documento detalla los cambios en el backend y cómo deben ser consumidos desde el frontend para soportar los nuevos campos: Rareza, Calidad, Variedad y Acabado.

1. Nuevos Campos en el Modelo de Auto
Los siguientes campos opcionales ahora forman parte del objeto 
Car
 (en endpoints como GET /cars/:id, GET /cars, GET /collection):

Campo	Tipo	Ejemplo de Valor
rarity	string	"Super Treasure Hunt (STH)"
quality	string	"Premium"
variety	string	"Car Culture"
finish	string	"Spectraflame"
2. Listas de Opciones (Selects/Dropdowns)
Para llenar los dropdowns en los formularios de Crear/Editar Auto, se deben utilizar los siguientes valores permitidos. Estos validan en el backend.

Rareza (rarity)
Básico
Treasure Hunt (TH)
Super Treasure Hunt (STH)
Chase
Calidad (quality)
Básico
Silver Series
Premium
Elite 64
RLC (Red Line Club)
Variedad (variety)
Team Transport
Boulevard
Car Culture
Classics
Collectors Convention
Garage
NFT
Mystery Models
Pop Culture
Speed Machines
Themed entertainment
Ultra Hots
Real Riders
Motorcycles
Legends
Red Line
Acabado (finish)
Anodizado
Cromado
Brilloso
Mate (opaco)
Metalizado
Perlado
Spectralflame
Translúcido
Nota: También se han actualizado las listas de Marcas (ej. se agregaron "Cupra", "Fantasía") y Colores (ej. "Zamac", "Sin pintar").

3. Filtrado en Colección (GET /collection)
El endpoint de colección (
getCarsFromUserIdPaginated
) soporta filtrado multi-select para estos nuevos campos.

Request (
CollectionQueryDTO
)
Enviar arrays de strings en los parámetros de query:

rarities[]: ['Super Treasure Hunt (STH)', 'Chase']
qualities[]: ['Premium']
varieties[]: ['Car Culture', 'Boulevard']
finishes[]: ['Spectraflame']
Response (
FilterOptions
)
El backend devuelve en filters los conteos actualizados para armar las facetas de búsqueda:

{
  "filters": {
    "rarities": [{ "name": "Super Treasure Hunt (STH)", "count": 5 }, ...],
    "qualities": [{ "name": "Premium", "count": 12 }, ...],
    "varieties": [...],
    "finishes": [...]
  }
}
4. Importación por Excel
Si se utiliza la funcionalidad de carga masiva por Excel:

El Template descargable ya incluye las columnas nuevas (Columnas I, J, K, L).
La hoja "Valores Permitidos" del Excel lista todas las opciones válidas mencionadas arriba.
El servicio valida automáticamente que los valores ingresados coincidan con estas listas.