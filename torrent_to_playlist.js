(function() {
    'use strict';

    // Регистрация плагина
    Lampa.Plugin.register({
        name: 'TorrentToPlaylist',
        version: '1.0.0',
        description: 'Добавляет все файлы из торрента в плейлист'
    });

    // Добавляем пункт в контекстное меню торрента
    Lampa.Listener.follow('torrent_menu', function(e) {
        let torrent = e.data.torrent;
        
        e.menu.push({
            title: 'Добавить все в плейлист',
            onSelect: function() {
                createPlaylistFromTorrent(torrent);
            }
        });
    });

    // Функция создания плейлиста
    function createPlaylistFromTorrent(torrent) {
        let playlist = [];
        
        // Получаем список файлов из торрента
        if (torrent && torrent.files) {
            torrent.files.forEach((file, index) => {
                playlist.push({
                    title: file.name || 'Файл ' + (index + 1),
                    url: file.url || torrent.url + '?file=' + index,
                    size: file.size || 0,
                    type: getFileType(file.name)
                });
            });
        }

        if (playlist.length > 0) {
            // Открываем плейлист в плеере
            Lampa.Player.play({
                playlist: playlist,
                title: torrent.title || 'Плейлист из торрента'
            });
        } else {
            Lampa.Noty.show('Не удалось создать плейлист: файлы не найдены');
        }
    }

    // Определение типа файла по расширению
    function getFileType(filename) {
        if (!filename) return 'video';
        
        const ext = filename.split('.').pop().toLowerCase();
        const videoExt = ['mp4', 'mkv', 'avi', 'mov', 'wmv'];
        const audioExt = ['mp3', 'wav', 'ogg', 'flac'];
        
        if (videoExt.includes(ext)) return 'video';
        if (audioExt.includes(ext)) return 'audio';
        return 'video'; // по умолчанию
    }

    // Добавляем стили (опционально)
    Lampa.Style.add(`
        .torrent-to-playlist-item {
            color: #fff;
            padding: 10px;
        }
    `);
})();
