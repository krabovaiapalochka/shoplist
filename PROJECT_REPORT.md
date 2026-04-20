# Отчет по проекту ShopList Android

## Обзор проекта

Мобильное приложение на React Native (Expo) для управления списками покупок.

---

## Файлы и их описание

| Файл | Описание |
|------|----------|
| `app/ShopListContext.tsx` | React Context для управления состоянием списков покупок |
| `app/shoplist-inside.tsx` | Экран просмотра/редактирования одного списка |
| `app/list-of-shoplists.tsx` | Главный экран со списком всех списков покупок |
| `app/_layout.tsx` | Корневой макет с навигацией и провайдерами |
| `app/profil.tsx` | Экран профиля пользователя |
| `app/login.tsx` | Экран входа |
| `app/registration-first.tsx` | Экран регистрации |
| `app/new-pass.tsx` | Экран смены пароля |
| `app/restor-pass.tsx` | Экран восстановления пароля |

---

## Компоненты и функции

### `ShopListContext.tsx`

**Типы:**
- `Item` — элемент списка (id, name, purchased)
- `ShopList` — список покупок (id, title, items, minHeight)
- `ShopListContextType` — интерфейс контекста

**Функции:**
- `addShopList(title, minHeight)` — создание нового списка
- `updateShopListTitle(id, title)` — обновление заголовка
- `addItemToList(listId, itemName)` — добавление товара
- `removeItemFromList(listId, itemId)` — удаление товара
- `toggleItemPurchased(listId, itemId)` — отметка о покупке
- `deleteShopList(id)` — удаление списка
- `getShopList(id)` — получение списка по ID
- `useShopLists()` — хук для использования контекста

### `shoplist-inside.tsx`

**Константы:**
- `DATABASE` — массив продуктов для поиска (49 наименований)

**Обработчики:**
- `handleDeleteList()` — удаление списка
- `handleTitleChange(newTitle)` — изменение названия
- `handleAddItem(productName)` — добавление товара
- `handleRemoveItem(itemId)` — удаление товара
- `handleTogglePurchased(itemId)` — переключение статуса покупки

### `list-of-shoplists.tsx`

**Функции:**
- `getRandomCardHeightStyle(min, max)` — генерация случайной высоты карточки

**Обработчики:**
- `handleAddList()` — создание нового списка
- `handleAddListDebug()` — создание списка (отладка)

### Экраны (UI компоненты)

- `Login` — форма входа (логин, пароль, видимость пароля)
- `Registration` — форма регистрации (email/тел, пароль)
- `RestorPass` — восстановление пароля (email, код)
- `NewPassword` — смена пароля (новый пароль, подтверждение)
- `ProfileScreen` — профиль пользователя (имя, тел, email, дата рождения)