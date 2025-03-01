(function() {
    'use strict';

    // Регистрируем плагин
    Lampa.Plugin.register({
        name: 'TorrentToPlaylist',
        version: '1.0.1',
        description: 'Добавляет все файлы из торрента в плейлист'
    });

    // Уведомление о загрузке плагина
    Lampa.Noty.show('Плагин TorrentToPlaylist загружен');

    // Подписываемся на событие torrent_menu
    Lampa.Listener.follow('torrent_menu', function(e) {
        Lampa.Noty.show('Событие torrent_menu сработало'); // Уведомление для проверки
        let torrent = e.data.torrent || e.data; // Пробуем разные варианты данных
        
        e.menu.push({
            title: 'Добавить все в плейлист',
            onSelect: function() {
                Lampa.Noty.show('Выбран пункт "Добавить все"');
                createPlaylistFromTorrent(torrent);
            }
        });
    });

    // Функция создания плейлиста
    function createPlaylistFromTorrent(torrent) {
        let playlist = [];
        
        // Проверяем разные возможные структуры данных
        let files = torrent && (torrent.files || (torrent.file && torrent.file.files) || torrent);
        if (files && Array.isArray(files)) {
            files.forEach((file, index) => {
                playlist.push({
                    title: file.name || file.title || 'Файл ' + (index + 1),
                    url: file.url || file.path || torrent.url + '?file=' + index,
                    size: file.size || 0,
                    type: getFileType(file.name || file.title)
                });
            });
        }

        if (playlist.length > 0) {
            Lampa.Player.play({
                playlist: playlist,
                title: torrent.title || 'Плейлист из торрента'
            });
            Lampa.Noty.show('Плейлист создан: ' + playlist.length + ' файлов');
        } else {
            Lampa.Noty.show('Не удалось создать плейлист: файлы не найдены');
        }
    }

    // Определение типа файла
    function getFileType(filename) {
        if (!filename) return 'video';
        const ext = filename.split('.').pop().toLowerCase();
        const videoExt = ['mp4', 'mkv', 'avi', 'mov', 'wmv'];
        const audioExt = ['mp3', 'wav', 'ogg', 'flac'];
        return videoExt.includes(ext) ? 'video' : audioExt.includes(ext) ? 'audio' : 'video';
    }
})();
