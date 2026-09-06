// Cabeçalho com fundo sólido ao descer na página
const header = document.getElementById('site-header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('solid');
  else header.classList.remove('solid');
};
onScroll();
window.addEventListener('scroll', onScroll, { passive:true });

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
menuToggle.addEventListener('click', () => {
  const open = mobilePanel.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobilePanel.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Links de WhatsApp com mensagem pronta
const WA_NUMBER = '5531973604506';
document.querySelectorAll('.wa-cta').forEach(a => {
  const msg = a.getAttribute('data-msg') || 'Olá! Vim pelo site e queria saber mais sobre as bolsas.';
  a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
});

// Galeria de fotos
const galleryEl = document.getElementById('gallery');
const pieces = [2,3,4,5,6,7,8,9,10,11,12,14,15,16,18,19,20,21,23,24];
const featureEvery = 5; // A cada 5 imagens uma é maior
pieces.forEach((n, i) => {
  const a = document.createElement('a');
  a.className = 'g-item' + ((i % featureEvery === 0) ? ' feature' : '');
  a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Olá! Vim pelo site e queria saber mais sobre as bolsas.');
  a.target = '_blank';
  a.rel = 'noopener';

  const img = document.createElement('img');
  img.className = 'zoomable';
  img.loading = 'lazy';
  img.src = n + '.jpeg';
  img.alt = 'Peça de crochê artesanal nº ' + n;
  img.onerror = function(){ a.remove(); };

  const cap = document.createElement('span');
  cap.className = 'cap';
  cap.textContent = 'Perguntar no WhatsApp';

  a.appendChild(img);
  a.appendChild(cap);
  galleryEl.appendChild(a);
});

// Funcionalidade de zoom nas imagens
const supportsHoldZoom = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (supportsHoldZoom) {
  const zoomPreview = document.getElementById('zoomPreview');
  const zoomImg = document.getElementById('zoomImg');
  const ZOOM_DELAY = 550;
  const TOLERANCE = 30;
  let zoomTimer = null;
  let isZoomOpen = false;
  let lastMousePos = { x: 0, y: 0 };
  let zoomTriggerElement = null;

  const showZoom = (img) => {
    zoomImg.src = img.currentSrc || img.src;
    zoomImg.alt = img.alt || '';
    zoomPreview.classList.add('show');
    zoomPreview.setAttribute('aria-hidden', 'false');
    isZoomOpen = true;
    zoomTriggerElement = img;
  };
  
  const cancelZoom = () => {
    clearTimeout(zoomTimer);
    zoomPreview.classList.remove('show');
    zoomPreview.setAttribute('aria-hidden', 'true');
    isZoomOpen = false;
    zoomTriggerElement = null;
  };

  const attachHoldZoom = (img) => {
    img.addEventListener('mouseenter', () => {
      clearTimeout(zoomTimer);
      lastMousePos = { x: event.clientX, y: event.clientY };
      zoomTimer = setTimeout(() => showZoom(img), ZOOM_DELAY);
    });

    img.addEventListener('mousemove', (e) => {
      if (isZoomOpen) return; // Se zoom já abriu, não cancela por movimento
      
      const deltaX = Math.abs(e.clientX - lastMousePos.x);
      const deltaY = Math.abs(e.clientY - lastMousePos.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > TOLERANCE) {
        clearTimeout(zoomTimer);
        lastMousePos = { x: e.clientX, y: e.clientY };
        zoomTimer = setTimeout(() => showZoom(img), ZOOM_DELAY);
      }
    });
  };

  // Clicar na imagem com zoom abre WhatsApp
  zoomImg.addEventListener('click', (e) => {
    e.stopPropagation();
    if (zoomTriggerElement) {
      const parent = zoomTriggerElement.closest('.wa-cta') || zoomTriggerElement.closest('a.g-item');
      if (parent && parent.href) {
        window.open(parent.href, '_blank');
      }
    }
  });
  
  // Cursor pointer para indicar clicabilidade
  zoomImg.style.cursor = 'pointer';

  // Clicar fora da imagem fecha o zoom
  zoomPreview.addEventListener('click', (e) => {
    if (e.target === zoomPreview) {
      cancelZoom();
    }
  });
  
  document.querySelectorAll('img.zoomable').forEach(attachHoldZoom);
  window.addEventListener('scroll', cancelZoom, { passive: true });
}