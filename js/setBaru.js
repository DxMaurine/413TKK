// Deobfuscation failed
let generatedImagesData = [],
  selectedForEnhancement = null
const generateBtn = document.getElementById('generate-btn'),
  enhanceBtn = document.getElementById('enhance-btn'),
  ideaBtn = document.getElementById('idea-btn'),
  copyBtn = document.getElementById('copy-btn'),
  pasteBtn = document.getElementById('paste-btn'),
  clearBtn = document.getElementById('clear-btn'),
  allActionButtons = [
    generateBtn,
    enhanceBtn,
    ideaBtn,
    copyBtn,
    pasteBtn,
    clearBtn,
  ],
  promptInput = document.getElementById('prompt-input'),
  loadingIndicator = document.getElementById('loading-indicator'),
  loadingText = document.getElementById('loading-text'),
  imageGrid = document.getElementById('image-grid'),
  historyContainer = document.getElementById('history-container'),
  historyPlaceholder = document.getElementById('history-placeholder'),
  infoModal = document.getElementById('info-modal'),
  infoModalTitle = document.getElementById('info-modal-title'),
  infoModalMessage = document.getElementById('info-modal-message'),
  previewModal = document.getElementById('preview-modal'),
  previewImage = document.getElementById('preview-image'),
  previewPrompt = document.getElementById('preview-prompt'),
  closePreviewBtn = document.getElementById('close-preview-btn'),
  reusePromptBtn = document.getElementById('reuse-prompt-btn'),
  donationBtn = document.getElementById('donation-btn'),
  donationModal = document.getElementById('donation-modal'),
  closeDonationBtn = document.getElementById('close-donation-btn'),
  sendDonationBtn = document.getElementById('send-donation-btn'),
  modelSelect = document.getElementById('model-select'),
  artStyleSelect = document.getElementById('art-style-select'),
  styleSelect = document.getElementById('style-select'),
  sizeSelect = document.getElementById('size-select'),
  batchSelect = document.getElementById('batch-select'),
  themeToggle = document.getElementById('theme-toggle'),
  themeIcon = document.getElementById('theme-icon'),
  themeText = document.getElementById('theme-text')
function resetGridToPlaceholder() {
  imageGrid.className = 'w-full h-full flex items-center justify-center'
  imageGrid.innerHTML =
    '\n                <div class="text-center text-gray-500">\n                    <i class="ph-fill ph-image-square text-6xl"></i>\n                    <p class="mt-4 font-medium">Gambar Anda akan muncul di sini</p>\n                </div>\n            '
}
resetGridToPlaceholder()
const toggleButtons = (_0x2229a4) =>
    [generateBtn, enhanceBtn, ideaBtn].forEach(
      (_0xf60f38) => (_0xf60f38.disabled = _0x2229a4)
    ),
  showInfoModal = (_0x5e7070, _0x12dffa) => {
    infoModalTitle.textContent = _0x5e7070
    infoModalMessage.textContent = _0x12dffa
    infoModal.classList.remove('hidden')
  },
  closeInfoModal = () => infoModal.classList.add('hidden')
function showPreviewModal(_0x353cbe, _0x4ab054) {
  previewImage.src = _0x353cbe
  _0x4ab054.length > 150
    ? (previewPrompt.textContent = _0x4ab054.substring(0, 150) + '...')
    : (previewPrompt.textContent = _0x4ab054)
  reusePromptBtn.onclick = () => {
    promptInput.value = _0x4ab054
    closePreviewModal()
    promptInput.focus()
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  previewModal.classList.remove('hidden')
}
function closePreviewModal() {
  previewModal.classList.add('hidden')
}
closePreviewBtn.addEventListener('click', closePreviewModal)
previewModal.addEventListener('click', (_0x55d1df) => {
  _0x55d1df.target.id === 'preview-modal' && closePreviewModal()
})
function openDonationModal() {
  donationModal.classList.remove('hidden')
}
function closeDonationModal() {
  donationModal.classList.add('hidden')
}
donationBtn.addEventListener('click', () => {
  openDonationModal();
  donationModal.style.zIndex = '99999'; // Ensure modal appears on top
});

closeDonationBtn.addEventListener('click', () => {
  closeDonationModal();
  donationModal.style.zIndex = ''; // Reset z-index
});

sendDonationBtn.addEventListener('click', () => {
  // Show info modal with high z-index
  infoModal.style.zIndex = '999999';
  showInfoModal(
    'Segera Hadir',
    'Fitur pembayaran donasi akan segera diimplementasikan. Terima kasih atas niat baik Anda!'
  );
  // Reset z-index after modal is closed
  infoModal.addEventListener('click', () => {
    infoModal.style.zIndex = '';
  }, {once: true});
});
async function downloadImage(_0x252894, _0x2d3669) {
  try {
    const _0x1bfbaf = await fetch(_0x252894)
    if (!_0x1bfbaf.ok) {
      throw new Error('Gagal mengambil data gambar dari server.')
    }
    const _0xfdc4ce = await _0x1bfbaf.blob(),
      _0x59b9e9 = window.URL.createObjectURL(_0xfdc4ce),
      _0x540457 = document.createElement('a')
    _0x540457.href = _0x59b9e9
    const _0x488bf2 = _0x2d3669
      .substring(0, 30)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
    _0x540457.download = 'tkk-imagen-' + (_0x488bf2 || 'image') + '.png'
    document.body.appendChild(_0x540457)
    _0x540457.click()
    document.body.removeChild(_0x540457)
    window.URL.revokeObjectURL(_0x59b9e9)
  } catch (_0x4f7cb9) {
    console.error('Download error:', _0x4f7cb9)
    showInfoModal(
      'Gagal Mengunduh',
      "Tidak dapat mengunduh gambar secara otomatis. Silakan coba klik kanan pada gambar dan pilih 'Simpan Gambar Sebagai...'."
    )
  }
}
async function getUserIP() {
  try {
    const _0x594e9e = await fetch('https://api.ipify.org?format=json')
    if (!_0x594e9e.ok) {
      throw new Error('Failed to get IP')
    }
    const _0x55a5db = await _0x594e9e.json()
    return _0x55a5db.ip
  } catch (_0x1f805a) {
    return (
      'unknown-ip-' +
      (localStorage.getItem('tkk-fallback-id') ||
        (() => {
          const _0x37551e = Math.random().toString(36).slice(2)
          return localStorage.setItem('tkk-fallback-id', _0x37551e), _0x37551e
        })())
    )
  }
}
async function saveHistoryToStorage() {
  const _0xe427ad = await getUserIP(),
    _0x57d926 = Date.now(),
    _0x38f92a = Array.from(historyContainer.querySelectorAll('img')).map(
      (_0x27b50c) => ({
        url: _0x27b50c.src,
        prompt: _0x27b50c.getAttribute('data-prompt') || '',
        ts: _0x57d926,
      })
    )
  localStorage.setItem(
    'tkk-history',
    JSON.stringify({
      ip: _0xe427ad,
      ts: _0x57d926,
      items: _0x38f92a,
    })
  )
}
async function loadHistoryFromStorage() {
  const _0x5ce6b5 = localStorage.getItem('tkk-history')
  if (!_0x5ce6b5) {
    return
  }
  let _0x19ece3
  try {
    _0x19ece3 = JSON.parse(_0x5ce6b5)
  } catch {
    return
  }
  const _0x479e51 = await getUserIP()
  if (_0x19ece3.ip !== _0x479e51) {
    return
  }
  if (Date.now() - _0x19ece3.ts > 86400000) {
    return
  }
  if (!Array.isArray(_0x19ece3.items)) {
    return
  }
  historyPlaceholder.classList.add('hidden')
  _0x19ece3.items.forEach((_0x599ef0) => {
    const _0x58794a = document.createElement('div')
    _0x58794a.className =
      'w-20 h-20 neumorphic-outset p-1 rounded-md flex-shrink-0'
    const _0x1f41ab = document.createElement('img')
    _0x1f41ab.src = _0x599ef0.url
    _0x1f41ab.setAttribute('data-prompt', _0x599ef0.prompt)
    _0x1f41ab.className = 'w-full h-full object-cover rounded-sm cursor-pointer'
    _0x1f41ab.onclick = () => showPreviewModal(_0x599ef0.url, _0x599ef0.prompt)
    _0x58794a.appendChild(_0x1f41ab)
    historyContainer.appendChild(_0x58794a)
  })
}
function addToHistory(_0x577142, _0x451785) {
  historyPlaceholder.classList.add('hidden')
  const _0x4d83d4 = document.createElement('div')
  _0x4d83d4.className =
    'w-20 h-20 neumorphic-outset p-1 rounded-md flex-shrink-0'
  const _0x1a2fcf = document.createElement('img')
  _0x1a2fcf.src = _0x577142
  _0x1a2fcf.setAttribute('data-prompt', _0x451785)
  _0x1a2fcf.className = 'w-full h-full object-cover rounded-sm cursor-pointer'
  _0x1a2fcf.onclick = () => showPreviewModal(_0x577142, _0x451785)
  _0x4d83d4.appendChild(_0x1a2fcf)
  historyContainer.prepend(_0x4d83d4)
  saveHistoryToStorage()
}
;(function () {
  let _0x249080 = document.getElementById('show-history-grid-btn')
  !_0x249080 &&
    ((_0x249080 = document.createElement('button')),
    (_0x249080.id = 'show-history-grid-btn'),
    (_0x249080.title = 'Lihat Semua History'),
    (_0x249080.className =
      'absolute top-2 right-2 z-10 p-2 bg-white dark:bg-red-900 rounded-full shadow hover:bg-gray-500 transition-colors'),
    (_0x249080.innerHTML =
      '<i class="ph-fill ph-images text-white text-xl theme-3d theme-glass"></i>'),
    (historyContainer.parentElement.style.position = 'relative'),
    historyContainer.parentElement.appendChild(_0x249080))
  let _0x3b5180 = document.getElementById('history-grid-modal')
  !_0x3b5180 &&
    ((_0x3b5180 = document.createElement('div')),
    (_0x3b5180.id = 'history-grid-modal'),
    (_0x3b5180.className =
      'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] hidden'),
    (_0x3b5180.innerHTML =
      '\n                <div class="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto relative theme-3d theme-glass">\n                <button id="close-history-grid-modal" class="absolute top-2 right-2 p-2 rounded-full hover:bg-red-500 dark:hover:bg-red-500 theme-btn theme-3d theme-glass">\n                    <i class="ph ph-x text-xl"></i>\n                </button>\n                <h2 class="text-lg font-bold mb-4 flex items-center gap-2 theme-text theme-3d theme-glass"><i class="ph-fill ph-images"></i> Semua History Gambar</h2>\n                <div id="history-grid-content" class="grid grid-cols-2 md:grid-cols-4 gap-4 theme-3d theme-glass"></div>\n                <div id="history-preview-container" class="mt-6 hidden theme-3d theme-glass">\n                    <div class="flex flex-col items-center">\n                    <img id="history-preview-image" class="max-w-full max-h-96 rounded-lg shadow mb-4 theme-3d theme-glass" />\n                    <div id="history-preview-prompt" class="theme-text text-sm text-center theme-3d theme-glass"></div>\n                    </div>\n                </div>\n                </div>\n            '),
    document.body.appendChild(_0x3b5180))
  _0x249080.onclick = async function () {
    const _0xdcc15b = localStorage.getItem('tkk-history')
    let _0x3c115d = null
    try {
      _0x3c115d = JSON.parse(_0xdcc15b)
    } catch {}
    const _0x16e196 = await getUserIP(),
      _0x17086b = _0x3b5180.querySelector('#history-grid-content'),
      _0x4d2394 = _0x3b5180.querySelector('#history-preview-container'),
      _0x5c7b8a = _0x3b5180.querySelector('#history-preview-image'),
      _0x28cf6e = _0x3b5180.querySelector('#history-preview-prompt')
    _0x17086b.innerHTML = ''
    _0x4d2394.classList.add('hidden')
    !_0x3c115d ||
    _0x3c115d.ip !== _0x16e196 ||
    Date.now() - _0x3c115d.ts > 86400000 ||
    !Array.isArray(_0x3c115d.items) ||
    !_0x3c115d.items.length
      ? (_0x17086b.innerHTML =
          '<div class="col-span-4 text-center text-gray-500">Belum ada history gambar.</div>')
      : _0x3c115d.items.forEach((_0x1fd493) => {
          const _0x1bc80a = document.createElement('div')
          _0x1bc80a.className = 'relative group'
          _0x1bc80a.innerHTML =
            '\n                    <img src="' +
            _0x1fd493.url +
            '" class="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer" />\n                    <button class="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition"><i class="ph ph-eye"></i></button>\n                '
          _0x1bc80a.querySelector('img').onclick = () => {
            _0x5c7b8a.src = _0x1fd493.url
            _0x28cf6e.textContent = _0x1fd493.prompt
            _0x4d2394.classList.remove('hidden')
          }
          _0x1bc80a.querySelector('button').onclick = (_0x188acb) => {
            _0x188acb.stopPropagation()
            _0x5c7b8a.src = _0x1fd493.url
            _0x28cf6e.textContent = _0x1fd493.prompt
            _0x4d2394.classList.remove('hidden')
          }
          _0x17086b.appendChild(_0x1bc80a)
        })
    _0x3b5180.classList.remove('hidden')
  }
  _0x3b5180.querySelector('#close-history-grid-modal').onclick = () =>
    _0x3b5180.classList.add('hidden')
  _0x3b5180.onclick = (_0x1844ef) => {
    if (_0x1844ef.target === _0x3b5180) {
      _0x3b5180.classList.add('hidden')
    }
  }
})()
window.addEventListener('DOMContentLoaded', () => {
  loadHistoryFromStorage()
})
enhanceBtn.addEventListener('click', async () => {
  const _0x324e56 = promptInput.value.trim()
  if (!_0x324e56) {
    showInfoModal('Prompt Kosong', 'Mohon masukkan ide prompt.')
    return
  }
  loadingText.textContent = 'Meningkatkan prompt...'
  loadingIndicator.classList.remove('hidden')
  toggleButtons(true)
  try {
    const _0x4b1af6 =
        'Please enhance the following image generation prompt to be more descriptive, vivid, and artistic. Respond only with the enhanced prompt, without any additional text, explanation, or quotation marks. The original prompt is: "' +
        _0x324e56 +
        '"',
      _0x3b96e4 =
        'https://text.pollinations.ai/' +
        encodeURIComponent(_0x4b1af6) +
        '&token=IU6OBB-pF3hKZVWC',
      _0xcd646 = await fetch(_0x3b96e4)
    if (!_0xcd646.ok) {
      throw new Error('Gagal menghubungi server: ' + _0xcd646.status)
    }
    const _0x55c4eb = await _0xcd646.text()
    promptInput.value = _0x55c4eb.trim().replace(/^"|"$/g, '')
  } catch (_0x4e7524) {
    showInfoModal('Gagal Meningkatkan', _0x4e7524.message)
  } finally {
    loadingIndicator.classList.add('hidden')
    toggleButtons(false)
  }
})
ideaBtn.addEventListener('click', async () => {
  loadingText.textContent = 'Mencari ide...'
  loadingIndicator.classList.remove('hidden')
  toggleButtons(true)
  try {
    const _0x37b640 =
        'Berikan satu ide prompt yang sangat kreatif dan tak terduga untuk generator gambar AI. Fokus pada konsep unik yang menggabungkan elemen yang tidak biasa. Berikan hanya promptnya, tanpa awalan atau penjelasan.',
      _0x4051bf = Math.random(),
      _0x15e72a =
        'https://text.pollinations.ai/' +
        encodeURIComponent(_0x37b640) +
        '?seed=' +
        _0x4051bf +
        '&token=IU6OBB-pF3hKZVWC',
      _0x21c3b2 = await fetch(_0x15e72a)
    if (!_0x21c3b2.ok) {
      throw new Error('Gagal menghubungi server: ' + _0x21c3b2.status)
    }
    const _0xfd2433 = await _0x21c3b2.text()
    promptInput.value = _0xfd2433.trim().replace(/"/g, '')
  } catch (_0x26f156) {
    console.error('Error getting idea:', _0x26f156)
    showInfoModal('Gagal Mendapat Ide', _0x26f156.message)
  } finally {
    loadingIndicator.classList.add('hidden')
    toggleButtons(false)
  }
})
copyBtn.addEventListener('click', () => {
  if (!promptInput.value) {
    showInfoModal('Prompt Kosong', 'Tidak ada teks untuk disalin.')
    return
  }
  const _0x3986f6 = document.createElement('textarea')
  _0x3986f6.value = promptInput.value
  document.body.appendChild(_0x3986f6)
  _0x3986f6.select()
  document.execCommand('copy')
  document.body.removeChild(_0x3986f6)
  const _0xd0d5 = copyBtn.innerHTML
  copyBtn.innerHTML =
    '<i class="ph-fill ph-check-circle"></i><span>Disalin!</span>'
  setTimeout(() => {
    copyBtn.innerHTML = _0xd0d5
  }, 2000)
})
pasteBtn.addEventListener('click', async () => {
  try {
    const _0x3633bb = await navigator.clipboard.readText()
    promptInput.value += _0x3633bb
  } catch (_0x2bb18f) {
    showInfoModal(
      'Gagal Menempel',
      'Browser Anda mungkin tidak mendukung fitur ini atau izin belum diberikan.'
    )
    console.error('Failed to read clipboard contents: ', _0x2bb18f)
  }
})
clearBtn.addEventListener('click', () => {
  promptInput.value = ''
})
async function generateImage(_0x545859) {
  const _0x326525 = [
      promptInput.value.trim(),
      modelSelect.value,
      artStyleSelect.value,
      styleSelect.value,
      sizeSelect.value,
    ],
    _0x4c78d8 = _0x545859 || _0x326525.filter(Boolean).join(', ')
  if (!promptInput.value.trim()) {
    showInfoModal('Prompt Kosong', 'Mohon masukkan deskripsi gambar.')
    return
  }
  loadingText.textContent = 'Membuat keajaiban...'
  loadingIndicator.classList.remove('hidden')
  toggleButtons(true)
  const _0x1d2b8e = parseInt(batchSelect.value, 10)
  imageGrid.innerHTML = ''
  imageGrid.className =
    _0x1d2b8e > 1 ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 gap-4'
  console.log('Final prompt:', _0x4c78d8, '| Batch size:', _0x1d2b8e)
  try {
    const _0x26f018 = []
    let _0x4dc38f, _0x426c97
    const _0x1ec6c0 = sizeSelect.value
    if (_0x1ec6c0.includes('16:9')) {
      _0x4dc38f = 1920
      _0x426c97 = 1080
    } else {
      _0x1ec6c0.includes('9:16')
        ? ((_0x4dc38f = 1080), (_0x426c97 = 1920))
        : ((_0x4dc38f = 1024), (_0x426c97 = 1024))
    }
    for (let _0x5bacc5 = 0; _0x5bacc5 < _0x1d2b8e; _0x5bacc5++) {
      const _0x8b9191 = encodeURIComponent(_0x4c78d8),
        _0x15247b = Math.floor(Math.random() * 100000),
        _0x416a2f =
          'https://image.pollinations.ai/prompt/' +
          _0x8b9191 +
          '?width=' +
          _0x4dc38f +
          '&height=' +
          _0x426c97 +
          '&nologo=true&seed=' +
          _0x15247b +
          '&token=IU6OBB-pF3hKZVWC'
      _0x26f018.push(fetch(_0x416a2f))
    }
    const _0xd47eb2 = await Promise.all(_0x26f018)
    generatedImagesData = []
    _0xd47eb2.forEach((_0x23859e, _0x39f10c) => {
      if (_0x23859e.ok) {
        const _0xe4da85 = _0x23859e.url
        generatedImagesData.push({
          url: _0xe4da85,
          prompt: _0x4c78d8,
        })
        let _0x2d77ea = document.createElement('div'),
          _0x3a16ae = _0xd47eb2.length
        if (_0x3a16ae === 2) {
          imageGrid.className = 'flex flex-col gap-4 overflow-auto max-h-[60vh]'
          _0x2d77ea.className =
            'preview-slot aspect-square neumorphic-inset flex items-center justify-center text-center p-2 relative cursor-pointer'
        } else {
          _0x3a16ae === 3 || _0x3a16ae === 4
            ? ((imageGrid.className =
                'flex flex-col gap-4 overflow-auto max-h-[60vh]'),
              (_0x2d77ea.className =
                'preview-slot aspect-square neumorphic-inset flex items-center justify-center text-center p-2 relative cursor-pointer'))
            : ((imageGrid.className =
                _0x3a16ae > 1
                  ? 'grid grid-cols-2 gap-4 overflow-auto max-h-[60vh]'
                  : 'grid grid-cols-1 gap-4 overflow-auto max-h-[60vh]'),
              (_0x2d77ea.className =
                'preview-slot aspect-square neumorphic-inset flex items-center justify-center text-center p-2 relative cursor-pointer'))
        }
        _0x2d77ea.innerHTML =
          '\n                            <img src="' +
          _0xe4da85 +
          '" class="generated-image w-full h-full object-contain rounded-md">\n                            <button class="download-btn absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors">\n                                <i class="ph-fill ph-download-simple"></i>\n                            </button>\n                        '
        imageGrid.appendChild(_0x2d77ea)
        _0x2d77ea.querySelector('.download-btn').onclick = async (
          _0x1d07e8
        ) => {
          _0x1d07e8.stopPropagation()
          await downloadImage(_0xe4da85, _0x4c78d8)
        }
        _0x2d77ea.onclick = () => showPreviewModal(_0xe4da85, _0x4c78d8)
        addToHistory(_0xe4da85, _0x4c78d8)
      } else {
        console.error(
          'Failed to generate image ' + (_0x39f10c + 1) + ':',
          _0x23859e.statusText
        )
      }
    })
  } catch (_0x237ee5) {
    console.error('Error generating image:', _0x237ee5)
    showInfoModal(
      'Terjadi Kesalahan',
      _0x237ee5.message || 'Gagal membuat gambar.'
    )
    resetGridToPlaceholder()
  } finally {
    loadingIndicator.classList.add('hidden')
    toggleButtons(false)
  }
}
generateBtn.addEventListener('click', () => generateImage())
const toolsContainer = document.getElementById('advanced-tools-container')
toolsContainer.addEventListener('click', (_0x3b0aab) => {
  const _0x886005 = _0x3b0aab.target.closest('.tool-btn')
  if (!_0x886005) {
    return
  }
  const _0x40f450 = _0x886005.dataset.tool
  if (!_0x40f450) {
    return
  }
  if (_0x40f450 === 'enhance' && generatedImagesData.length === 0) {
    showInfoModal(
      'Gambar Tidak Ditemukan',
      'Anda harus membuat gambar terlebih dahulu sebelum bisa meningkatkannya.'
    )
    return
  }
  const _0x303594 = document.getElementById('tool-content-' + _0x40f450),
    _0x15d78c = _0x886005.classList.contains('active')
  toolsContainer
    .querySelectorAll('.tool-btn')
    .forEach((_0x126644) => _0x126644.classList.remove('active'))
  toolsContainer
    .querySelectorAll('.tool-content')
    .forEach((_0x96ad4d) => _0x96ad4d.classList.remove('expanded'))
  !_0x15d78c &&
    (_0x886005.classList.add('active'),
    _0x303594 &&
      (_0x303594.classList.add('expanded'),
      _0x40f450 === 'enhance' && populateEnhancePanel()))
})
const videoIdeaBtn = document.getElementById('video-idea-btn'),
  videoPromptMain = document.getElementById('video-prompt-main')
videoIdeaBtn.addEventListener('click', async () => {
  loadingText.textContent = 'Membuat skenario...'
  loadingIndicator.classList.remove('hidden')
  videoIdeaBtn.disabled = true
  try {
    const _0x3b035b = Math.random(),
      _0x1cf536 =
        'https://text.pollinations.ai/' +
        encodeURIComponent(
          'Berikan satu ide skenario video yang detail dan sinematik. Fokus pada deskripsi visual, atmosfer, dan aksi. Berikan hanya skenarionya, tanpa awalan atau penjelasan.'
        ) +
        '?seed=' +
        _0x3b035b +
        '&token=IU6OBB-pF3hKZVWC',
      _0x2c3457 = await fetch(_0x1cf536)
    if (!_0x2c3457.ok) {
      throw new Error('Gagal menghubungi server: ' + _0x2c3457.status)
    }
    const _0xfee218 = await _0x2c3457.text()
    videoPromptMain.value = _0xfee218.trim().replace(/"/g, '')
  } catch (_0x4d37ea) {
    console.error('Error getting video idea:', _0x4d37ea)
    showInfoModal('Gagal Mendapat Ide Video', _0x4d37ea.message)
  } finally {
    loadingIndicator.classList.add('hidden')
    videoIdeaBtn.disabled = false
  }
})
document
  .getElementById('download-video-prompt-btn')
  .addEventListener('click', () => {
    const _0x2d75ed = document.getElementById('video-prompt-main').value,
      _0x243221 = document.getElementById('video-style').value,
      _0x362045 = document.getElementById('video-angle').value,
      _0x556018 = document.getElementById('video-movement').value,
      _0x490b26 = document.getElementById('video-duration').value
    if (!_0x2d75ed) {
      showInfoModal('Prompt Kosong', 'Mohon isi ide utama untuk video.')
      return
    }
    const _0xbc19d9 = (
        '\nSCENE: ' +
        _0x2d75ed +
        '.\nVISUAL STYLE: ' +
        _0x243221 +
        '.\nCAMERA: ' +
        _0x362045 +
        ', ' +
        _0x556018 +
        '.\nDURATION: ' +
        _0x490b26 +
        '.\n'
      ).trim(),
      _0xc7c233 = new Blob([_0xbc19d9], { type: 'text/plain' }),
      _0x5eab7d = URL.createObjectURL(_0xc7c233),
      _0x2db806 = document.createElement('a')
    _0x2db806.href = _0x5eab7d
    _0x2db806.download = 'prompt-video.txt'
    document.body.appendChild(_0x2db806)
    _0x2db806.click()
    document.body.removeChild(_0x2db806)
    URL.revokeObjectURL(_0x5eab7d)
  })
const audioVoiceModelSelect = document.getElementById('audio-voice-model'),
  audioNarration = document.getElementById('audio-narration'),
  audioCharacter = document.getElementById('audio-character'),
  audioIdeaBtn = document.getElementById('audio-idea-btn'),
  generateAudioBtn = document.getElementById('generate-audio-btn'),
  clearAudioBtn = document.getElementById('clear-audio-btn'),
  audioResultContainer = document.getElementById('audio-result-container'),
  voiceModels = [
    'alloy',
    'echo',
    'fable',
    'onyx',
    'nova',
    'shimmer',
    'coral',
    'verse',
    'ballad',
    'ash',
    'sage',
    'amuch',
    'aster',
    'brook',
    'clover',
    'dan',
    'elan',
    'marilyn',
    'meadow',
    'jazz',
    'rio',
  ]
voiceModels.forEach((_0x100267) => {
  const _0x445cb9 = document.createElement('option')
  _0x445cb9.value = _0x100267
  _0x445cb9.textContent = _0x100267.charAt(0).toUpperCase() + _0x100267.slice(1)
  audioVoiceModelSelect.appendChild(_0x445cb9)
})
audioIdeaBtn.addEventListener('click', async () => {
  const _0x414324 = audioCharacter.value.trim() || 'seorang narator'
  loadingText.textContent = 'Membuat narasi...'
  loadingIndicator.classList.remove('hidden')
  audioIdeaBtn.disabled = true
  try {
    const _0x431df7 =
        'Buatkan sebuah narasi singkat dengan karakter suara seperti ' +
        _0x414324 +
        '. Berikan hanya narasinya, tanpa awalan atau penjelasan.',
      _0x331a04 = Math.random(),
      _0x1a3560 =
        'https://text.pollinations.ai/' +
        encodeURIComponent(_0x431df7) +
        '?seed=' +
        _0x331a04 +
        '&token=IU6OBB-pF3hKZVWC',
      _0x116853 = await fetch(_0x1a3560)
    if (!_0x116853.ok) {
      throw new Error('Gagal menghubungi server: ' + _0x116853.status)
    }
    const _0x36a0e6 = await _0x116853.text()
    audioNarration.value = _0x36a0e6.trim().replace(/"/g, '')
  } catch (_0x12327e) {
    console.error('Error getting audio idea:', _0x12327e)
    showInfoModal('Gagal Mendapat Ide Narasi', _0x12327e.message)
  } finally {
    loadingIndicator.classList.add('hidden')
    audioIdeaBtn.disabled = false
  }
})
generateAudioBtn.addEventListener('click', async () => {
  const _0x5609da = audioNarration.value.trim()
  if (!_0x5609da) {
    showInfoModal(
      'Teks Kosong',
      'Mohon masukkan teks narasi yang ingin diubah menjadi suara.'
    )
    return
  }
  const _0x3fcf99 = generateAudioBtn.querySelector('.btn-text'),
    _0x1deef8 = generateAudioBtn.querySelector('svg')
  _0x3fcf99.classList.add('hidden')
  _0x1deef8.classList.remove('hidden')
  generateAudioBtn.disabled = true
  audioResultContainer.classList.add('hidden')
  audioResultContainer.innerHTML = ''
  try {
    const _0x25a114 =
        'You are a text-to-speech agent. Do not comment, do not respond. Only read aloud the text exactly as written, with no additions. The input is: ',
      _0x5ab452 = _0x25a114 + _0x5609da,
      _0x1cd956 = audioVoiceModelSelect.value,
      _0x3ee21f = encodeURIComponent(_0x5ab452),
      _0x79dcce =
        'https://text.pollinations.ai/' +
        _0x3ee21f +
        '?model=openai-audio&voice=' +
        _0x1cd956 +
        '&token=IU6OBB-pF3hKZVWC',
      _0x162e87 = await fetch(_0x79dcce)
    if (!_0x162e87.ok) {
      throw new Error('Gagal membuat audio: ' + _0x162e87.statusText)
    }
    const _0x43c0e2 = await _0x162e87.blob(),
      _0x5535ff = URL.createObjectURL(_0x43c0e2),
      _0x2bfb73 = document.createElement('audio')
    _0x2bfb73.controls = true
    _0x2bfb73.src = _0x5535ff
    const _0x2abf24 = document.createElement('a')
    _0x2abf24.href = _0x5535ff
    _0x2abf24.download = 'audio-narasi.mp3'
    _0x2abf24.innerHTML = '<i class="ph-fill ph-download-simple text-xl"></i>'
    _0x2abf24.className = 'neumorphic-outset-interactive p-2 rounded-full'
    const _0x5e9f8b = document.createElement('div')
    _0x5e9f8b.className = 'flex items-center gap-4 mt-2'
    _0x5e9f8b.appendChild(_0x2bfb73)
    _0x5e9f8b.appendChild(_0x2abf24)
    audioResultContainer.appendChild(_0x5e9f8b)
    audioResultContainer.classList.remove('hidden')
  } catch (_0x2834d7) {
    console.error('Error generating audio:', _0x2834d7)
    showInfoModal('Gagal Membuat Audio', _0x2834d7.message)
  } finally {
    _0x3fcf99.classList.remove('hidden')
    _0x1deef8.classList.add('hidden')
    generateAudioBtn.disabled = false
  }
})
clearAudioBtn.addEventListener('click', () => {
  audioCharacter.value = ''
  audioNarration.value = ''
  audioResultContainer.classList.add('hidden')
  audioResultContainer.innerHTML = ''
})
const enhanceThumbnails = document.getElementById('enhance-thumbnails'),
  enhanceOptionsContainer = document.getElementById(
    'enhance-options-container'
  ),
  enhancePreview = document.getElementById('enhance-preview'),
  runEnhanceBtn = document.getElementById('run-enhance-btn'),
  enhanceResultContainer = document.getElementById('enhance-result-container'),
  beforeImage = document.getElementById('before-image'),
  afterCanvas = document.getElementById('after-canvas'),
  downloadEnhancedBtn = document.getElementById('download-enhanced-btn')
function populateEnhancePanel() {
  enhanceThumbnails.innerHTML = ''
  enhanceOptionsContainer.classList.add('hidden')
  enhanceResultContainer.classList.add('hidden')
  selectedForEnhancement = null
  generatedImagesData.forEach((_0x45f5c4, _0x35088d) => {
    const _0x4f9732 = document.createElement('img')
    _0x4f9732.src = _0x45f5c4.url
    _0x4f9732.className =
      'w-16 h-16 object-cover rounded-md cursor-pointer enhance-thumbnail'
    _0x4f9732.onclick = () => selectImageForEnhancement(_0x35088d, _0x4f9732)
    enhanceThumbnails.appendChild(_0x4f9732)
  })
}
function selectImageForEnhancement(_0x5be557, _0x564e5a) {
  enhanceThumbnails
    .querySelectorAll('img')
    .forEach((_0x5a53ff) => _0x5a53ff.classList.remove('selected'))
  _0x564e5a.classList.add('selected')
  selectedForEnhancement = generatedImagesData[_0x5be557]
  enhancePreview.src = selectedForEnhancement.url
  enhanceOptionsContainer.classList.remove('hidden')
}
function applyFilter(_0x3fb89f, _0x220f3f) {
  return new Promise((_0x783e42, _0x5dfc52) => {
    const _0x269935 = afterCanvas,
      _0x3ae3e8 = _0x269935.getContext('2d'),
      _0x496742 = new Image()
    _0x496742.crossOrigin = 'Anonymous'
    _0x496742.src = _0x3fb89f
    _0x496742.onload = () => {
      _0x269935.width = _0x496742.width
      _0x269935.height = _0x496742.height
      let _0x19a7f4 = ''
      switch (_0x220f3f) {
        case 'sharpen':
          _0x19a7f4 = 'contrast(1.2) saturate(1.1)'
          break
        case 'grayscale':
          _0x19a7f4 = 'grayscale(100%)'
          break
        case 'sepia':
          _0x19a7f4 = 'sepia(100%)'
          break
        case 'invert':
          _0x19a7f4 = 'invert(100%)'
          break
        case 'vintage':
          _0x19a7f4 = 'sepia(60%) contrast(1.1) brightness(0.9) saturate(1.2)'
          break
        case 'high-contrast':
          _0x19a7f4 = 'contrast(1.5) saturate(1.2)'
          break
        default:
          _0x19a7f4 = 'none'
          break
      }
      _0x3ae3e8.filter = _0x19a7f4
      _0x3ae3e8.drawImage(_0x496742, 0, 0)
      _0x783e42(_0x269935.toDataURL('image/png'))
    }
    _0x496742.onerror = (_0x34cbef) => {
      console.error('Image loading error for canvas:', _0x34cbef)
      _0x5dfc52(_0x34cbef)
    }
  })
}
runEnhanceBtn.addEventListener('click', async () => {
  if (!selectedForEnhancement) {
    showInfoModal(
      'Pilih Gambar',
      'Silakan pilih gambar yang ingin ditingkatkan terlebih dahulu.'
    )
    return
  }
  loadingText.textContent = 'Menerapkan filter...'
  loadingIndicator.classList.remove('hidden')
  runEnhanceBtn.disabled = true
  try {
    const _0x238f72 = document.getElementById('enhance-filter-select').value,
      _0x5762d5 = selectedForEnhancement.url,
      _0x4abb48 = await applyFilter(_0x5762d5, _0x238f72)
    beforeImage.src = _0x5762d5
    enhanceResultContainer.classList.remove('hidden')
    downloadEnhancedBtn.onclick = () =>
      downloadImage(_0x4abb48, 'enhanced-' + selectedForEnhancement.prompt)
  } catch (_0x26b1c3) {
    console.error('Enhance error:', _0x26b1c3)
    showInfoModal(
      'Gagal Meningkatkan',
      'Terjadi kesalahan saat menerapkan filter. Pastikan gambar dapat diakses.'
    )
  } finally {
    loadingIndicator.classList.add('hidden')
    runEnhanceBtn.disabled = false
  }
})
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode')
  const _0x2045fb = document.body.classList.contains('dark-mode')
  _0x2045fb
    ? ((themeIcon.className = 'ph ph-moon text-xl text-indigo-400'),
      (themeText.textContent = 'Dark Mode'))
    : ((themeIcon.className = 'ph ph-sun text-xl text-amber-500'),
      (themeText.textContent = 'Light Mode'))
})
window.addEventListener('DOMContentLoaded', () => {
  !document.body.classList.contains('dark-mode') && themeToggle.click()
})
;(function () {
  const _0x2c71d5 = document.querySelector('.tool-btn[data-tool="chat"]'),
    _0x334c21 = document.getElementById('tool-content-chat'),
    _0x1bbcc3 = document.getElementById('chat-messages'),
    _0x5023f7 = document.getElementById('chat-form'),
    _0x24e262 = document.getElementById('chat-input')
  let _0x3d9cd9 = [
    {
      role: 'system',
      content:
        'Kamu adalah asisten AI yang hanya membantu membuat prompt untuk image generation model flux, turbo, dan gptimage. Jawab hanya seputar pembuatan prompt, jangan menjawab hal lain.',
    },
  ]
  function _0x2c1637() {
    _0x1bbcc3.innerHTML = ''
    _0x3d9cd9.forEach((_0x525a7e, _0x476c2e) => {
      if (_0x525a7e.role === 'system') {
        return
      }
      const _0x32df17 = document.createElement('div')
      _0x32df17.className =
        _0x525a7e.role === 'user' ? 'text-right' : 'text-left'
      if (_0x525a7e.role === 'user') {
        _0x32df17.innerHTML =
          '<span class="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded px-3 py-2">' +
          _0x525a7e.content +
          '</span>'
      } else {
        let _0x2b3e23 = _0x525a7e.content.match(/prompt\s*:\s*(.+)/i),
          _0x12b14b = _0x2b3e23 ? _0x2b3e23[1] : ''
        if (!_0x12b14b && _0x525a7e.content.length < 300) {
          _0x12b14b = _0x525a7e.content
        }
        _0x12b14b && _0x12b14b.length > 5
          ? (_0x32df17.innerHTML =
              '\n                                                    <span class="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2">' +
              _0x525a7e.content +
              '</span>\n                                                    <div class="mt-2">\n                                                        <button class="btn btn-secondary btn-use-prompt text-xs px-3 py-1" data-prompt="' +
              encodeURIComponent(_0x12b14b) +
              '">\n                                                            <i class="ph-fill ph-arrow-fat-line-right"></i> Use Prompt\n                                                        </button>\n                                                    </div>\n                                                ')
          : (_0x32df17.innerHTML =
              '<span class="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2">' +
              _0x525a7e.content +
              '</span>')
      }
      _0x1bbcc3.appendChild(_0x32df17)
    })
    _0x1bbcc3.scrollTop = _0x1bbcc3.scrollHeight
  }
  _0x1bbcc3.addEventListener('click', function (_0x77f80d) {
    const _0x51c1aa = _0x77f80d.target.closest('.btn-use-prompt')
    if (!_0x51c1aa) {
      return
    }
    const _0x13d622 = decodeURIComponent(_0x51c1aa.dataset.prompt || ''),
      _0x4b29e0 = document.getElementById('prompt-input')
    _0x4b29e0 &&
      ((_0x4b29e0.value = _0x13d622),
      showInfoModal(
        'Prompt Ditempel',
        'Prompt dari asisten telah ditempel ke area utama.'
      ))
  })
  const _0xf44ac3 = _0x2c1637
  function _0x2c1637() {
    _0x1bbcc3.innerHTML = ''
    _0x3d9cd9.forEach((_0xc6ae96, _0x2872f9) => {
      if (_0xc6ae96.role === 'system') {
        return
      }
      const _0x35dcf4 = document.createElement('div')
      _0x35dcf4.className =
        _0xc6ae96.role === 'user' ? 'text-right' : 'text-left'
      if (_0xc6ae96.role === 'user') {
        _0x35dcf4.innerHTML =
          '<span class="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded px-3 py-2">' +
          _0xc6ae96.content +
          '</span>'
      } else {
        const _0x555014 = _0xc6ae96.content
        _0x35dcf4.innerHTML =
          '\n                                                <span class="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2">' +
          _0xc6ae96.content +
          '</span>\n                                                <div class="mt-2">\n                                                    <button class="btn btn-secondary btn-use-prompt text-xs px-3 py-1" data-prompt="' +
          encodeURIComponent(_0x555014) +
          '">\n                                                        <i class="ph-fill ph-arrow-fat-line-right"></i> Use Prompt\n                                                    </button>\n                                                </div>\n                                            '
      }
      _0x1bbcc3.appendChild(_0x35dcf4)
    })
    _0x1bbcc3.scrollTop = _0x1bbcc3.scrollHeight
  }
  _0x5023f7.addEventListener('submit', async function (_0x3f088b) {
    _0x3f088b.preventDefault()
    const _0x1221bd = _0x24e262.value.trim()
    if (!_0x1221bd) {
      return
    }
    _0x3d9cd9.push({
      role: 'user',
      content: _0x1221bd,
    })
    _0x2c1637()
    _0x24e262.value = ''
    const _0x23ae61 = document.createElement('div')
    _0x23ae61.className = 'text-left'
    _0x23ae61.innerHTML =
      '<span class="inline-block bg-gray-200 dark:bg-gray-700 text-gray-500 rounded px-3 py-2 animate-pulse">Mengetik...</span>'
    _0x1bbcc3.appendChild(_0x23ae61)
    _0x1bbcc3.scrollTop = _0x1bbcc3.scrollHeight
    try {
      const _0x4fd47e = await fetch(
        'https://text.pollinations.ai/openai?token=IU6OBB-pF3hKZVWC',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: _0x3d9cd9,
            system:
              'Kamu adalah asisten AI yang hanya membantu membuat prompt untuk image generation model flux, turbo, dan gptimage. Jawab hanya seputar pembuatan prompt, jangan menjawab hal lain.',
          }),
        }
      )
      if (!_0x4fd47e.ok) {
        throw new Error('Gagal menghubungi asisten.')
      }
      const _0x3aee60 = await _0x4fd47e.json()
let responseContent = (response.choices?.[0]?.message?.content || '').trim()
      if (!_0x2c9539) {
        _0x2c9539 = 'Maaf, saya tidak dapat memproses permintaan Anda.'
      }
      _0x3d9cd9.push({
        role: 'assistant',
        content: _0x2c9539,
      })
    } catch (_0xb25b59) {
      _0x3d9cd9.push({
        role: 'assistant',
        content: 'Terjadi kesalahan: ' + _0xb25b59.message,
      })
    }
    _0x2c1637()
  })
  _0x2c71d5 &&
    _0x2c71d5.addEventListener('click', () => {
      setTimeout(() => {
        _0x24e262 && _0x24e262.focus()
      }, 300)
    })
  _0x2c1637()
})()
;(function () {
  const _0x3013c5 = document.getElementById('chat-messages')
  let _0x3ce155 = false,
    _0x57e634 = [
      {
        role: 'system',
        content:
          'Kamu adalah asisten AI yang hanya membantu membuat prompt untuk image generation model flux, turbo, dan gptimage. Jawab hanya seputar pembuatan prompt, jangan menjawab hal lain.',
      },
    ],
    _0x4bfbc1 = 0
  const _0x2468f6 = window.renderChat || function () {}
  function _0x101f4e(_0x16b3d0 = 20, _0x4886f0 = false) {
    const _0x2ed0f9 = _0x57e634.filter(
        (_0x3cac22) => _0x3cac22.role !== 'system'
      ),
      _0x30e9f3 = Math.max(0, _0x2ed0f9.length - _0x4bfbc1 - _0x16b3d0),
      _0x27290a = _0x2ed0f9.length - _0x4bfbc1,
      _0x10ead7 = _0x2ed0f9.slice(_0x30e9f3, _0x27290a)
    if (!_0x4886f0) {
      _0x3013c5.innerHTML = ''
    }
    _0x10ead7.forEach((_0x2b5aca, _0x445e73) => {
      const _0x5a62e4 = document.createElement('div')
      _0x5a62e4.className =
        _0x2b5aca.role === 'user' ? 'text-right' : 'text-left'
      if (_0x2b5aca.role === 'user') {
        _0x5a62e4.innerHTML =
          '<span class="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded px-3 py-2">' +
          _0x2b5aca.content +
          '</span>'
      } else {
        let _0x247ebc = _0x2b5aca.content.match(/prompt\s*:\s*(.+)/i),
          _0x37e980 = _0x247ebc ? _0x247ebc[1] : ''
        if (!_0x37e980 && _0x2b5aca.content.length < 300) {
          _0x37e980 = _0x2b5aca.content
        }
        _0x37e980 && _0x37e980.length > 5
          ? (_0x5a62e4.innerHTML =
              '\n                                                        <span class="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2">' +
              _0x2b5aca.content +
              '</span>\n                                                        <div class="mt-2">\n                                                            <button class="btn btn-secondary btn-use-prompt text-xs px-3 py-1" data-prompt="' +
              encodeURIComponent(_0x37e980) +
              '">\n                                                                <i class="ph-fill ph-arrow-fat-line-right"></i> Use Prompt\n                                                            </button>\n                                                        </div>\n                                                    ')
          : (_0x5a62e4.innerHTML =
              '<span class="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-2">' +
              _0x2b5aca.content +
              '</span>')
      }
      _0x4886f0
        ? _0x3013c5.insertBefore(_0x5a62e4, _0x3013c5.firstChild)
        : _0x3013c5.appendChild(_0x5a62e4)
    })
    if (!_0x4886f0) {
      _0x3013c5.scrollTop = _0x3013c5.scrollHeight
    }
  }
  _0x101f4e()
  _0x3013c5.addEventListener('scroll', async function () {
    if (_0x3013c5.scrollTop <= 10 && !_0x3ce155) {
      _0x3ce155 = true
      const _0x56fad5 = _0x3013c5.scrollHeight,
        _0x12825d = _0x57e634.filter((_0x19911e) => _0x19911e.role !== 'system')
      _0x4bfbc1 + 20 < _0x12825d.length
        ? ((_0x4bfbc1 += 20),
          _0x101f4e(20, true),
          setTimeout(() => {
            _0x3013c5.scrollTop = _0x3013c5.scrollHeight - _0x56fad5
            _0x3ce155 = false
          }, 0))
        : (_0x3ce155 = false)
    }
  })
  _0x3013c5.style.overflowY = 'auto'
  _0x3013c5.style.maxHeight = '100%'
  _0x3013c5.style.minHeight = '0'
  window.renderChat = function () {
    _0x4bfbc1 = 0
    _0x101f4e()
  }
  window.getChatHistory = () => _0x57e634
  window.setChatHistory = (_0x66a519) => {
    _0x57e634 = _0x66a519
    window.renderChat()
  }
  window.chatHistory && (_0x57e634 = window.chatHistory)
  window.chatHistory = _0x57e634
})()
;(function () {
  let _0x2ee43a = null,
    _0x5ad82f = 'bottomright',
    _0x130f0f = ''
  const _0x8f6295 = document.getElementById('watermark-thumbnails'),
    _0x32a96c = document.getElementById('watermark-options-container'),
    _0x4f9a65 = document.getElementById('watermark-preview-container'),
    _0x1c8f3f = document.getElementById('watermark-canvas'),
    _0x1c187c = document.getElementById('watermark-text'),
    _0x2fde24 = document.getElementById('watermark-fontsize'),
    _0x4fcd96 = document.getElementById('watermark-fontsize-value'),
    _0x590c29 = document.getElementById('watermark-opacity'),
    _0x4486dd = document.getElementById('watermark-opacity-value'),
    _0x550a79 = document.getElementById('watermark-color'),
    _0x32810f = document.getElementById('watermark-fontfamily'),
    _0x2a6346 = document.getElementById('watermark-logo-upload'),
    _0x4852b5 = document.getElementById('watermark-logo-preview'),
    _0x380a15 = document.getElementById('watermark-remove-logo'),
    _0x5449c8 = document.getElementById('watermark-logo-size'),
    _0x1189d1 = document.getElementById('watermark-logo-size-value'),
    _0x33ecc0 = document.getElementById('watermark-logo-opacity'),
    _0x4af602 = document.getElementById('watermark-logo-opacity-value'),
    _0x4a5032 = document.getElementById('watermark-anchor-grid'),
    _0x351d8e = document.getElementById('download-watermark-btn'),
    _0x2a58cb = document.getElementById('clear-watermark-btn')
  function _0xbb926d() {
    _0x8f6295.innerHTML = ''
    _0x32a96c.classList.add('hidden')
    _0x4f9a65.classList.add('hidden')
    _0x2ee43a = null
    _0x130f0f = ''
    _0x4852b5.src = ''
    _0x4852b5.classList.add('hidden')
    _0x380a15.classList.add('hidden')
    _0x1c187c.value = ''
    _0x2fde24.value = 36
    _0x4fcd96.textContent = '36px'
    _0x590c29.value = 40
    _0x4486dd.textContent = '40%'
    _0x550a79.value = '#ffffff'
    _0x32810f.value = 'Arial'
    _0x5449c8.value = 30
    _0x1189d1.textContent = '30%'
    _0x33ecc0.value = 40
    _0x4af602.textContent = '40%'
    _0x5ad82f = 'bottomright'
    _0x4a5032
      .querySelectorAll('.anchor-btn')
      .forEach((_0x521d25) => _0x521d25.classList.remove('bg-indigo-200'))
    _0x4a5032
      .querySelector('[data-anchor="bottomright"]')
      .classList.add('bg-indigo-200')
    generatedImagesData.forEach((_0x5499bf, _0x44b229) => {
      const _0x4fb09a = document.createElement('img')
      _0x4fb09a.src = _0x5499bf.url
      _0x4fb09a.className =
        'w-16 h-16 object-cover rounded-md cursor-pointer enhance-thumbnail'
      _0x4fb09a.onclick = () => _0x561b9f(_0x44b229, _0x4fb09a)
      _0x8f6295.appendChild(_0x4fb09a)
    })
  }
  function _0x561b9f(_0x48fb96, _0x429f00) {
    _0x8f6295
      .querySelectorAll('img')
      .forEach((_0x390381) => _0x390381.classList.remove('selected'))
    _0x429f00.classList.add('selected')
    _0x2ee43a = generatedImagesData[_0x48fb96]
    _0x32a96c.classList.remove('hidden')
    _0x4f9a65.classList.remove('hidden')
    _0xf972b0()
  }
  _0x2a6346.addEventListener('change', function (_0x3a5b6d) {
    const _0x51995a = _0x3a5b6d.target.files[0]
    if (!_0x51995a) {
      return
    }
    const _0xb76cb5 = new FileReader()
    _0xb76cb5.onload = function (_0x351191) {
      _0x130f0f = _0x351191.target.result
      _0x4852b5.src = _0x130f0f
      _0x4852b5.classList.remove('hidden')
      _0x380a15.classList.remove('hidden')
      _0xf972b0()
    }
    _0xb76cb5.readAsDataURL(_0x51995a)
  })
  _0x380a15.addEventListener('click', function () {
    _0x130f0f = ''
    _0x4852b5.src = ''
    _0x4852b5.classList.add('hidden')
    _0x380a15.classList.add('hidden')
    _0x2a6346.value = ''
    _0xf972b0()
  })
  _0x4a5032.addEventListener('click', function (_0x4186b2) {
    const _0x434c02 = _0x4186b2.target.closest('.anchor-btn')
    if (!_0x434c02) {
      return
    }
    _0x5ad82f = _0x434c02.dataset.anchor
    _0x4a5032
      .querySelectorAll('.anchor-btn')
      .forEach((_0x4a5a68) => _0x4a5a68.classList.remove('bg-indigo-200'))
    _0x434c02.classList.add('bg-indigo-200')
    _0xf972b0()
  })
  ;[
    _0x1c187c,
    _0x2fde24,
    _0x590c29,
    _0x550a79,
    _0x32810f,
    _0x5449c8,
    _0x33ecc0,
  ].forEach((_0x4a3abe) => {
    _0x4a3abe.addEventListener('input', _0xf972b0)
  })
  _0x2fde24.addEventListener(
    'input',
    () => (_0x4fcd96.textContent = _0x2fde24.value + 'px')
  )
  _0x590c29.addEventListener(
    'input',
    () => (_0x4486dd.textContent = _0x590c29.value + '%')
  )
  _0x5449c8.addEventListener(
    'input',
    () => (_0x1189d1.textContent = _0x5449c8.value + '%')
  )
  _0x33ecc0.addEventListener(
    'input',
    () => (_0x4af602.textContent = _0x33ecc0.value + '%')
  )
  _0x32810f.addEventListener('change', _0xf972b0)
  async function _0xf972b0() {
    if (!_0x2ee43a) {
      return
    }
    const _0x457b8e = new Image()
    _0x457b8e.crossOrigin = 'Anonymous'
    _0x457b8e.src = _0x2ee43a.url
    _0x457b8e.onload = async function () {
      _0x1c8f3f.width = _0x457b8e.width
      _0x1c8f3f.height = _0x457b8e.height
      const _0x287476 = _0x1c8f3f.getContext('2d')
      _0x287476.clearRect(0, 0, _0x457b8e.width, _0x457b8e.height)
      _0x287476.drawImage(_0x457b8e, 0, 0)
      if (_0x130f0f) {
        const _0x46630c = new Image()
        _0x46630c.src = _0x130f0f
        await new Promise((_0x44c652) => {
          _0x46630c.onload = _0x44c652
        })
        const _0x3a7868 = _0x5449c8.value / 100,
          _0x1af1e5 = _0x457b8e.width * _0x3a7868,
          _0x5aba30 = _0x46630c.height * (_0x1af1e5 / _0x46630c.width),
          [_0x2c9da8, _0x2b57c6] = _0x2f61ad(
            _0x457b8e.width,
            _0x457b8e.height,
            _0x1af1e5,
            _0x5aba30,
            _0x5ad82f,
            10
          )
        _0x287476.globalAlpha = _0x33ecc0.value / 100
        _0x287476.drawImage(
          _0x46630c,
          _0x2c9da8,
          _0x2b57c6,
          _0x1af1e5,
          _0x5aba30
        )
        _0x287476.globalAlpha = 1
      }
      if (_0x1c187c.value.trim()) {
        _0x287476.save()
        _0x287476.font =
          _0x2fde24.value + 'px "' + _0x32810f.value + '", Arial, sans-serif'
        _0x287476.fillStyle = _0x550a79.value
        _0x287476.globalAlpha = _0x590c29.value / 100
        _0x287476.textBaseline = 'top'
        const _0x518223 = _0x1c187c.value.trim(),
          _0x1ae08f = _0x287476.measureText(_0x518223),
          _0x507535 = _0x1ae08f.width,
          _0x4c65e3 = _0x2fde24.value * 1.2,
          [_0x5757b4, _0x51dac5] = _0x2f61ad(
            _0x457b8e.width,
            _0x457b8e.height,
            _0x507535,
            _0x4c65e3,
            _0x5ad82f,
            10
          )
        _0x287476.fillText(_0x518223, _0x5757b4, _0x51dac5)
        _0x287476.globalAlpha = 1
        _0x287476.restore()
      }
    }
  }
  function _0x2f61ad(
    _0x198611,
    _0x39fc36,
    _0x341a70,
    _0x389e3b,
    _0x18d7dc,
    _0x5dbe5e
  ) {
    let _0x42c2fe = 0,
      _0x17d56e = 0
    switch (_0x18d7dc) {
      case 'topleft':
        ;(_0x42c2fe = _0x5dbe5e), (_0x17d56e = _0x5dbe5e)
        break
      case 'top':
        ;(_0x42c2fe = (_0x198611 - _0x341a70) / 2), (_0x17d56e = _0x5dbe5e)
        break
      case 'topright':
        ;(_0x42c2fe = _0x198611 - _0x341a70 - _0x5dbe5e),
          (_0x17d56e = _0x5dbe5e)
        break
      case 'left':
        ;(_0x42c2fe = _0x5dbe5e), (_0x17d56e = (_0x39fc36 - _0x389e3b) / 2)
        break
      case 'center':
        ;(_0x42c2fe = (_0x198611 - _0x341a70) / 2),
          (_0x17d56e = (_0x39fc36 - _0x389e3b) / 2)
        break
      case 'right':
        ;(_0x42c2fe = _0x198611 - _0x341a70 - _0x5dbe5e),
          (_0x17d56e = (_0x39fc36 - _0x389e3b) / 2)
        break
      case 'bottomleft':
        ;(_0x42c2fe = _0x5dbe5e),
          (_0x17d56e = _0x39fc36 - _0x389e3b - _0x5dbe5e)
        break
      case 'bottom':
        ;(_0x42c2fe = (_0x198611 - _0x341a70) / 2),
          (_0x17d56e = _0x39fc36 - _0x389e3b - _0x5dbe5e)
        break
      case 'bottomright':
        ;(_0x42c2fe = _0x198611 - _0x341a70 - _0x5dbe5e),
          (_0x17d56e = _0x39fc36 - _0x389e3b - _0x5dbe5e)
        break
    }
    return [_0x42c2fe, _0x17d56e]
  }
  _0x351d8e.addEventListener('click', function () {
    if (!_0x2ee43a) {
      return
    }
    const _0x371a46 = document.createElement('a')
    _0x371a46.href = _0x1c8f3f.toDataURL('image/png')
    _0x371a46.download = 'tkk-imagen-watermarked.png'
    document.body.appendChild(_0x371a46)
    _0x371a46.click()
    document.body.removeChild(_0x371a46)
  })
  _0x2a58cb.addEventListener('click', function () {
    _0x1c187c.value = ''
    _0x2fde24.value = 36
    _0x4fcd96.textContent = '36px'
    _0x590c29.value = 40
    _0x4486dd.textContent = '40%'
    _0x550a79.value = '#ffffff'
    _0x32810f.value = 'Arial'
    _0x5449c8.value = 30
    _0x1189d1.textContent = '30%'
    _0x33ecc0.value = 40
    _0x4af602.textContent = '40%'
    _0x130f0f = ''
    _0x4852b5.src = ''
    _0x4852b5.classList.add('hidden')
    _0x380a15.classList.add('hidden')
    _0x2a6346.value = ''
    _0x5ad82f = 'bottomright'
    _0x4a5032
      .querySelectorAll('.anchor-btn')
      .forEach((_0x6491c1) => _0x6491c1.classList.remove('bg-indigo-200'))
    _0x4a5032
      .querySelector('[data-anchor="bottomright"]')
      .classList.add('bg-indigo-200')
    _0xf972b0()
  })
  const _0x32e7d6 = document.getElementById('advanced-tools-container')
  _0x32e7d6.addEventListener('click', (_0x3a01bb) => {
    const _0x5cce9d = _0x3a01bb.target.closest('.tool-btn')
    if (!_0x5cce9d) {
      return
    }
    const _0x56919a = _0x5cce9d.dataset.tool
    if (_0x56919a === 'watermark') {
      if (generatedImagesData.length === 0) {
        showInfoModal(
          'Gambar Tidak Ditemukan',
          'Anda harus membuat gambar terlebih dahulu sebelum bisa menambahkan watermark.'
        )
        return
      }
      _0xbb926d()
    }
  })
  ;[
    _0x1c187c,
    _0x2fde24,
    _0x590c29,
    _0x550a79,
    _0x32810f,
    _0x5449c8,
    _0x33ecc0,
  ].forEach((_0x3fc249) => _0x3fc249.addEventListener('input', _0xf972b0))
  _0x2a6346.addEventListener('change', _0xf972b0)
})()
;(function () {
  const _0x3390a4 = document.getElementById('upscale-image-upload'),
    _0x234d36 = document.getElementById('upscale-image-preview'),
    _0x51eb79 = document.getElementById('upscale-remove-image'),
    _0x25b4b4 = document.getElementById('upscale-generate-btn'),
    _0xcb8150 = document.getElementById('upscale-result-container'),
    _0x167a93 = document.getElementById('upscale-result-text'),
    _0x319d74 = document.getElementById('upscale-use-prompt-btn')
  let _0x2a6a75 = ''
  _0x3390a4.addEventListener('change', function (_0x4229bd) {
    const _0x46337e = _0x4229bd.target.files[0]
    if (!_0x46337e) {
      return
    }
    const _0x190986 = new FileReader()
    _0x190986.onload = function (_0x374811) {
      _0x2a6a75 = _0x374811.target.result
      _0x234d36.src = _0x2a6a75
      _0x234d36.classList.remove('hidden')
      _0x51eb79.classList.remove('hidden')
      _0x25b4b4.disabled = false
    }
    _0x190986.readAsDataURL(_0x46337e)
  })
  _0x51eb79.addEventListener('click', function () {
    _0x2a6a75 = ''
    _0x234d36.src = ''
    _0x234d36.classList.add('hidden')
    _0x51eb79.classList.add('hidden')
    _0x3390a4.value = ''
    _0x25b4b4.disabled = true
    _0xcb8150.classList.add('hidden')
    _0x167a93.textContent = ''
  })
  _0x25b4b4.addEventListener('click', async function () {
    if (!_0x2a6a75) {
      return
    }
    _0x25b4b4.disabled = true
    _0xcb8150.classList.add('hidden')
    _0x167a93.textContent = ''
    const _0x1a96f3 = document.getElementById('loading-indicator'),
      _0x331b13 = document.getElementById('loading-text')
    _0x331b13.textContent = 'Menganalisa gambar...'
    _0x1a96f3.classList.remove('hidden')
    try {
      let _0x599378 = _0x2a6a75
      _0x599378.startsWith('data:') &&
        (_0x599378 = _0x599378.substring(_0x599378.indexOf(',') + 1))
      const _0x22322a = await fetch('/api/generatePrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: _0x599378 }),
      })
      if (!_0x22322a.ok) {
        throw new Error('Gagal menghubungi server.')
      }
      const _0x38ecd6 = await _0x22322a.json()
      let _0x5e32ce = (_0x38ecd6.prompt || '').trim()
      if (!_0x5e32ce) {
        _0x5e32ce = 'Maaf, tidak dapat menganalisa gambar.'
      }
      _0x167a93.textContent = _0x5e32ce
      _0xcb8150.classList.remove('hidden')
      _0x319d74.dataset.prompt = encodeURIComponent(_0x5e32ce)
    } catch (_0x5b7e53) {
      _0x167a93.textContent = 'Terjadi kesalahan: ' + _0x5b7e53.message
      _0xcb8150.classList.remove('hidden')
    } finally {
      _0x25b4b4.disabled = false
      _0x1a96f3.classList.add('hidden')
    }
  })
  _0x319d74.addEventListener('click', function () {
    const _0x50de89 = decodeURIComponent(_0x319d74.dataset.prompt || ''),
      _0x423f79 = document.getElementById('prompt-input')
    _0x423f79 &&
      ((_0x423f79.value = _0x50de89),
      typeof showInfoModal === 'function' &&
        showInfoModal(
          'Prompt Ditempel',
          'Prompt dari hasil analisa gambar telah ditempel ke area utama.'
        ))
  })
})()
;(function () {
  function _0x531340() {
    const _0x1bd472 = document.getElementById('video-prompt-main').value.trim(),
      _0x5ea53c = document.getElementById('video-style').value,
      _0x49df6c = document.getElementById('video-angle').value,
      _0x5c8401 = document.getElementById('video-movement').value
    let _0xd011f3 = document.getElementById('video-duration').value
    _0xd011f3 === 'custom' &&
      (_0xd011f3 =
        document.getElementById('video-duration-custom').value.trim() ||
        'custom')
    let _0x56e82f = document.getElementById('video-resolution').value
    _0x56e82f === 'custom' &&
      (_0x56e82f =
        document.getElementById('video-resolution-custom').value.trim() ||
        'custom')
    const _0x10e34f = document.getElementById('video-platform').value,
      _0x51f9ae = document.getElementById('video-language').value,
      _0x500bde = document.getElementById('video-extra').value.trim()
    let _0x210fe6 = ''
    _0x210fe6 += 'SCENE: ' + (_0x1bd472 || '[Isi ide utama/skenario]') + '\n'
    _0x210fe6 += 'VISUAL STYLE: ' + _0x5ea53c + '\n'
    _0x210fe6 += 'CAMERA ANGLE: ' + _0x49df6c + '\n'
    _0x210fe6 += 'CAMERA MOVEMENT: ' + _0x5c8401 + '\n'
    _0x210fe6 += 'DURATION: ' + _0xd011f3 + '\n'
    _0x210fe6 += 'RESOLUTION: ' + _0x56e82f + '\n'
    _0x210fe6 += 'PLATFORM: ' + _0x10e34f + '\n'
    if (_0x500bde) {
      _0x210fe6 += 'EXTRA DETAILS: ' + _0x500bde + '\n'
    }
    return (
      (_0x210fe6 += 'LANGUAGE: ' + _0x51f9ae + '\n'),
      (_0x210fe6 +=
        '# Prompt ini dapat digunakan di semua platform video AI (Veo, Kling, Sora, Pika, Runway, dll)\n'),
      _0x210fe6
    )
  }
  document
    .getElementById('video-duration')
    .addEventListener('change', function () {
      document
        .getElementById('video-duration-custom')
        .classList.toggle('hidden', this.value !== 'custom')
    })
  document
    .getElementById('video-resolution')
    .addEventListener('change', function () {
      document
        .getElementById('video-resolution-custom')
        .classList.toggle('hidden', this.value !== 'custom')
    })
  const _0x37f211 = document.getElementById('export-dropdown-btn'),
    _0x1a1cad = document.getElementById('export-dropdown-menu')
  _0x37f211.addEventListener('click', function (_0x510f11) {
    _0x510f11.stopPropagation()
    _0x1a1cad.classList.toggle('hidden')
  })
  document.addEventListener('click', function (_0x5357d3) {
    !_0x1a1cad.classList.contains('hidden') && _0x1a1cad.classList.add('hidden')
  })
  _0x1a1cad.addEventListener('click', function (_0x3fc787) {
    _0x3fc787.stopPropagation()
  })
  const _0x2fc1de = document.getElementById('video-prompt-preview-container')
  _0x2fc1de.classList.add('hidden')
  function _0x12d9e4() {
    document.getElementById('video-prompt-preview').textContent = _0x531340()
  }
  ;[
    'video-prompt-main',
    'video-style',
    'video-angle',
    'video-movement',
    'video-duration',
    'video-duration-custom',
    'video-resolution',
    'video-resolution-custom',
    'video-platform',
    'video-language',
    'video-extra',
  ].forEach((_0x57bb93) => {
    document.getElementById(_0x57bb93).addEventListener('input', _0x12d9e4)
    document.getElementById(_0x57bb93).addEventListener('change', _0x12d9e4)
  })
  _0x12d9e4()
  document
    .getElementById('download-video-prompt-btn')
    .addEventListener('click', function () {
      const _0x1c7b2e = _0x531340(),
        _0x51d5b1 = new Blob([_0x1c7b2e], { type: 'text/plain' }),
        _0x3f73a8 = URL.createObjectURL(_0x51d5b1),
        _0x1f0abe = document.createElement('a')
      _0x1f0abe.href = _0x3f73a8
      _0x1f0abe.download = 'video-prompt.txt'
      document.body.appendChild(_0x1f0abe)
      _0x1f0abe.click()
      document.body.removeChild(_0x1f0abe)
      URL.revokeObjectURL(_0x3f73a8)
      _0x1a1cad.classList.add('hidden')
    })
  document
    .getElementById('export-video-prompt-pdf-btn')
    .addEventListener('click', function () {
      const _0x25549c = _0x531340(),
        { jsPDF: _0x1a6053 } = window.jspdf,
        _0x4a2352 = new _0x1a6053()
      _0x4a2352.setFont('courier', 'normal')
      _0x4a2352.setFontSize(12)
      const _0x8599e0 = _0x4a2352.splitTextToSize(_0x25549c, 180)
      _0x4a2352.text(_0x8599e0, 10, 20)
      _0x4a2352.save('video-prompt.pdf')
      _0x1a1cad.classList.add('hidden')
    })
  document
    .getElementById('copy-video-prompt-btn')
    .addEventListener('click', function () {
      const _0xc5bc24 = _0x531340()
      navigator.clipboard.writeText(_0xc5bc24).then(() => {
        this.innerHTML =
          '<i class="ph-fill ph-check-circle"></i><span>Disalin!</span>'
        setTimeout(() => {
          this.innerHTML = '<i class="ph-fill ph-copy"></i> Salin Prompt'
        }, 2000)
      })
      _0x1a1cad.classList.add('hidden')
    })
  document
    .getElementById('generate-video-preview-btn')
    .addEventListener('click', function () {
      const _0xb2d334 = document.getElementById('video-preview-result'),
        _0x4d7e07 = document.getElementById('video-preview-result-text'),
        _0x56d38b = _0x531340()
      _0x2fc1de.classList.remove('hidden')
      document.getElementById('video-prompt-preview').textContent = _0x56d38b
      _0x4d7e07.textContent =
        'Preview Video akan dibuat berdasarkan prompt berikut:\n\n' + _0x56d38b
      _0xb2d334.classList.remove('hidden')
    })
  ;[
    'video-prompt-main',
    'video-style',
    'video-angle',
    'video-movement',
    'video-duration',
    'video-duration-custom',
    'video-resolution',
    'video-resolution-custom',
    'video-platform',
    'video-language',
    'video-extra',
  ].forEach((_0x514ee6) => {
    document.getElementById(_0x514ee6).addEventListener('input', function () {
      _0x2fc1de.classList.add('hidden')
      document.getElementById('video-preview-result').classList.add('hidden')
    })
    document.getElementById(_0x514ee6).addEventListener('change', function () {
      _0x2fc1de.classList.add('hidden')
      document.getElementById('video-preview-result').classList.add('hidden')
    })
  })
})()
document
  .getElementById('info-editor-tools-btn')
  .addEventListener('click', function () {
    typeof showInfoModal === 'function' &&
      showInfoModal(
        'Editor Tools',
        'Panel ini berisi alat-alat lanjutan untuk mengedit, meningkatkan, atau menambahkan efek pada gambar hasil AI Anda. Pilih salah satu alat untuk mulai menggunakan fitur seperti video prompt, audio tools, enhance, watermark, image to prompt, atau chat asisten.'
      )
  })
const tipsAccordionToggle = document.getElementById('tips-accordion-toggle'),
  tipsAccordionContent = document.getElementById('tips-accordion-content'),
  tipsAccordionArrow = document.getElementById('tips-accordion-arrow')
tipsAccordionToggle.addEventListener('click', () => {
  const _0x3024e1 = !tipsAccordionContent.classList.contains('hidden')
  tipsAccordionContent.classList.toggle('hidden')
  tipsAccordionArrow.classList.toggle('rotate-180', !_0x3024e1)
})
document
  .getElementById('reset-batch-btn')
  .addEventListener('click', function () {
    document.getElementById('batch-select').selectedIndex = 0
  })
document
  .getElementById('info-advanced-options-btn')
  .addEventListener('click', function () {
    typeof showInfoModal === 'function' &&
      showInfoModal(
        'Advanced Options',
        'Panel ini berisi pengaturan lanjutan untuk memilih model AI, gaya seni, pencahayaan, ukuran gambar, dan jumlah batch gambar yang ingin dihasilkan. Pastikan Anda memilih opsi yang sesuai dengan kebutuhan sebelum menekan tombol Generate.'
      )
  })
const stockPromptToggle = document.getElementById('stock-prompt-toggle'),
  stockPromptContent = document.getElementById('stock-prompt-content'),
  stockPromptArrow = document.getElementById('stock-prompt-arrow')
stockPromptToggle.addEventListener('click', () => {
  const _0x129e7d = !stockPromptContent.classList.contains('hidden')
  stockPromptContent.classList.toggle('hidden')
  stockPromptArrow.classList.toggle('rotate-180', !_0x129e7d)
})
stockPromptContent.addEventListener('click', function (_0x121358) {
  const _0x5e3d6b = _0x121358.target.closest('.btn-use-stock-prompt')
  if (!_0x5e3d6b) {
    return
  }
  const _0x34ace1 = _0x5e3d6b.dataset.prompt || '',
    _0xd2cbb8 = document.getElementById('prompt-input')
  _0xd2cbb8 &&
    ((_0xd2cbb8.value = _0x34ace1),
    typeof showInfoModal === 'function' &&
      showInfoModal(
        'Prompt Ditempel',
        'Prompt dari Stock Prompt telah ditempel ke area utama.'
      ))
})
document
  .getElementById('info-generate-btn')
  .addEventListener('click', function () {
    typeof showInfoModal === 'function' &&
      showInfoModal(
        'Panel Image Generator',
        'Panel ini memungkinkan Anda untuk membuat gambar menggunakan AI dengan memasukkan prompt yang diinginkan. Anda dapat mengatur model AI, gaya seni, pencahayaan, ukuran, dan jumlah gambar yang ingin dihasilkan. Gunakan tombol Enhance untuk meningkatkan kualitas prompt Anda, Copy untuk menyalin prompt, Paste untuk menempelkan prompt dari clipboard, dan Clear untuk menghapus prompt yang ada.'
      )
  })
const neumorphicToggle = document.getElementById('neumorphic-toggle'),
  neumorphicIcon = document.getElementById('neumorphic-icon'),
  neumorphicText = document.getElementById('neumorphic-text')
neumorphicToggle.addEventListener('click', () => {
  const _0x5a78db = document.body.classList.toggle('neumorphic-3d')
  _0x5a78db
    ? (document.body.classList.remove('dark-mode'),
      (neumorphicIcon.className = 'ph ph-cube text-xl text-indigo-500'),
      (neumorphicText.textContent = '3D Mode'))
    : ((neumorphicIcon.className = 'ph ph-cube text-xl text-gray-500'),
      (neumorphicText.textContent = '3D Mode'))
})
const accentToggle = document.getElementById('accent-toggle'),
  accentColorPicker = document.getElementById('accent-color-picker'),
  accentUndoBtn = document.getElementById('accent-undo-btn')
let accentDefault = '#cc0044',
  accentPrev = accentDefault
function updateAccentToggleUI() {
  const _0x14c996 = accentToggle,
    _0x37c94a = _0x14c996.parentElement.querySelector('div')
  _0x14c996.checked
    ? (_0x37c94a.classList.add('bg-indigo-500'),
      _0x37c94a.classList.remove('bg-gray-200'),
      (_0x37c94a.style.boxShadow = '0 0 0 2px #6366f1'),
      (_0x37c94a.style.transition = 'background 0.3s'))
    : (_0x37c94a.classList.remove('bg-indigo-500'),
      _0x37c94a.classList.add('bg-gray-200'),
      (_0x37c94a.style.boxShadow = ''))
}
function setAccentColor(_0x1c6439) {
  document.documentElement.style.setProperty('--primary-color', _0x1c6439)
  accentPrev = _0x1c6439
}
accentColorPicker.addEventListener('input', function () {
  accentToggle.checked && setAccentColor(this.value)
})
accentToggle.addEventListener('change', function () {
  updateAccentToggleUI()
  this.checked
    ? setAccentColor(accentColorPicker.value)
    : setAccentColor(accentDefault)
})
updateAccentToggleUI()
accentUndoBtn.addEventListener('click', function () {
  accentColorPicker.value = accentDefault
  setAccentColor(accentDefault)
  accentToggle.checked = false
  updateAccentToggleUI()
})
const resetToggle = document.getElementById('reset-toggle'),
  resetConfirmModal = document.getElementById('reset-confirm-modal'),
  resetYes = document.getElementById('reset-confirm-yes'),
  resetNo = document.getElementById('reset-confirm-no')
function updateResetToggleUI() {
  const _0x2af3bb = resetToggle,
    _0x27902f = _0x2af3bb.parentElement.querySelector('div')
  _0x2af3bb.checked
    ? (_0x27902f.classList.add('bg-red-500'),
      _0x27902f.classList.remove('bg-gray-200'),
      (_0x27902f.style.boxShadow = '0 0 0 2px #ef4444'),
      (_0x27902f.style.transition = 'background 0.3s'))
    : (_0x27902f.classList.remove('bg-red-500'),
      _0x27902f.classList.add('bg-gray-200'),
      (_0x27902f.style.boxShadow = ''))
}
resetToggle.addEventListener('change', function () {
  updateResetToggleUI()
  this.checked && resetConfirmModal.classList.remove('hidden')
})
resetYes.addEventListener('click', function () {
  accentColorPicker.value = accentDefault
  setAccentColor(accentDefault)
  accentToggle.checked = false
  updateAccentToggleUI()
  document.getElementById('api-key-input').value = ''
  resetToggle.checked = false
  updateResetToggleUI()
  resetConfirmModal.classList.add('hidden')
  const _0x511dd9 = document.getElementById('prompt-input')
  if (_0x511dd9) {
    _0x511dd9.value = ''
  }
  ;[
    'model-select',
    'art-style-select',
    'style-select',
    'size-select',
    'batch-select',
  ].forEach((_0x45307d) => {
    const _0x3dd7ff = document.getElementById(_0x45307d)
    if (_0x3dd7ff) {
      _0x3dd7ff.selectedIndex = 0
    }
  })
  if (window.generatedImagesData) {
    window.generatedImagesData = []
  }
  const _0x2caf25 = document.getElementById('image-grid')
  _0x2caf25 &&
    ((_0x2caf25.className = 'w-full h-full flex items-center justify-center'),
    (_0x2caf25.innerHTML =
      '\n                <div class="text-center text-gray-500">\n                <i class="ph-fill ph-image-square text-6xl"></i>\n                <p class="mt-4 font-medium">Gambar Anda akan muncul di sini</p>\n                </div>\n            '))
  const _0x22a7d6 = document.getElementById('history-container'),
    _0x3af0c1 = document.getElementById('history-placeholder')
  _0x22a7d6 &&
    _0x3af0c1 &&
    ((_0x22a7d6.innerHTML = ''),
    _0x3af0c1.classList.remove('hidden'),
    _0x22a7d6.appendChild(_0x3af0c1))
  const _0x51c2ce = document.getElementById('enhance-thumbnails'),
    _0x4621c5 = document.getElementById('enhance-options-container'),
    _0x366baf = document.getElementById('enhance-result-container')
  if (_0x51c2ce) {
    _0x51c2ce.innerHTML = ''
  }
  if (_0x4621c5) {
    _0x4621c5.classList.add('hidden')
  }
  if (_0x366baf) {
    _0x366baf.classList.add('hidden')
  }
  const _0x4231ec = document.getElementById('watermark-thumbnails'),
    _0x3493c0 = document.getElementById('watermark-options-container'),
    _0x5ac0f5 = document.getElementById('watermark-preview-container')
  if (_0x4231ec) {
    _0x4231ec.innerHTML = ''
  }
  if (_0x3493c0) {
    _0x3493c0.classList.add('hidden')
  }
  if (_0x5ac0f5) {
    _0x5ac0f5.classList.add('hidden')
  }
  const _0x1be06f = document.getElementById('audio-character'),
    _0x182739 = document.getElementById('audio-narration'),
    _0x326d0d = document.getElementById('audio-result-container')
  if (_0x1be06f) {
    _0x1be06f.value = ''
  }
  if (_0x182739) {
    _0x182739.value = ''
  }
  _0x326d0d && (_0x326d0d.classList.add('hidden'), (_0x326d0d.innerHTML = ''))
  const _0x34a317 = document.getElementById('video-prompt-main')
  if (_0x34a317) {
    _0x34a317.value = ''
  }
  window.setChatHistory &&
    window.setChatHistory([
      {
        role: 'system',
        content:
          'Kamu adalah asisten AI yang hanya membantu membuat prompt untuk image generation model flux, turbo, dan gptimage. Jawab hanya seputar pembuatan prompt, jangan menjawab hal lain.',
      },
    ])
  const _0x3ea264 = document.getElementById('theme-icon'),
    _0x5c2591 = document.getElementById('theme-text')
  _0x3ea264 &&
    _0x5c2591 &&
    ((_0x3ea264.className = 'ph ph-sun text-xl text-amber-500'),
    (_0x5c2591.textContent = 'Light Mode'))
  const _0xcc042f = document.getElementById('neumorphic-icon'),
    _0x191acf = document.getElementById('neumorphic-text')
  _0xcc042f &&
    _0x191acf &&
    ((_0xcc042f.className = 'ph ph-cube text-xl text-gray-500'),
    (_0x191acf.textContent = '3D Mode'))
})
resetNo.addEventListener('click', function () {
  resetToggle.checked = false
  updateResetToggleUI()
  resetConfirmModal.classList.add('hidden')
})
accentToggle.checked
  ? setAccentColor(accentColorPicker.value)
  : setAccentColor(accentDefault)
updateAccentToggleUI()
updateResetToggleUI()
const navSettingBtn = document.getElementById('nav-setting'),
  settingModal = document.getElementById('setting-modal'),
  closeSettingModal = document.getElementById('close-setting-modal')
navSettingBtn.addEventListener('click', () => {
  settingModal.classList.remove('hidden')
})
closeSettingModal.addEventListener('click', () => {
  settingModal.classList.add('hidden')
})
settingModal.addEventListener('click', (_0x25aaea) => {
  _0x25aaea.target === settingModal && settingModal.classList.add('hidden')
})
