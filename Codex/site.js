// Small site JS: menu toggle, timeline and map interaction
(function(){
  function init(){
    // Menu toggle for mobile
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    if(toggle && nav){
      toggle.addEventListener('click', ()=>{
        const open = nav.classList.toggle('main-nav--open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    // Timeline: click items to show detail in #timeline-details
    const timelineItems = document.querySelectorAll('.timeline__item');
    const timelineDetails = document.getElementById('timeline-details');
    if(timelineItems && timelineDetails){
      timelineItems.forEach(item => {
        item.addEventListener('click', ()=>{
          timelineItems.forEach(i=>i.classList.remove('active'));
          item.classList.add('active');
          const year = item.querySelector('span')?.textContent || '';
          const title = item.querySelector('h3')?.textContent || '';
          const detail = item.dataset.detail || '';
          timelineDetails.innerHTML = `<h3>${year} — ${title}</h3><p>${detail || 'Program details coming soon.'}</p>`;
          timelineDetails.scrollIntoView({behavior:'smooth', block:'nearest'});
        });
      });
    }

    const projectTableRows = document.querySelectorAll('.project-table tbody tr');
    const projectSummary = document.querySelector('.project-filter-summary');
    const sectorFilters = document.querySelectorAll('.taxonomy-filter--sector');
    const statusFilters = document.querySelectorAll('.taxonomy-filter--status');

    const applyProjectFilters = () => {
      const sectorValue = document.querySelector('.taxonomy-filter--sector.is-active')?.dataset.value || 'all';
      const statusValue = document.querySelector('.taxonomy-filter--status.is-active')?.dataset.value || 'all';
      let visibleCount = 0;

      projectTableRows.forEach((row) => {
        const rowSector = row.dataset.sector || 'all';
        const rowStatus = row.dataset.status || 'all';
        const sectorMatch = sectorValue === 'all' || rowSector === sectorValue;
        const statusMatch = statusValue === 'all' || rowStatus === statusValue;
        const showRow = sectorMatch && statusMatch;
        row.style.display = showRow ? '' : 'none';
        if (showRow) visibleCount += 1;
      });

      if (projectSummary) {
        const label = visibleCount === 1 ? 'programme' : 'programmes';
        projectSummary.textContent = `Showing ${visibleCount} active ${label} across the national portfolio.`;
      }
    };

    sectorFilters.forEach((button) => {
      button.addEventListener('click', () => {
        sectorFilters.forEach((item) => item.classList.toggle('is-active', item === button));
        applyProjectFilters();
      });
    });

    statusFilters.forEach((button) => {
      button.addEventListener('click', () => {
        statusFilters.forEach((item) => item.classList.toggle('is-active', item === button));
        applyProjectFilters();
      });
    });

    if (projectTableRows.length) {
      applyProjectFilters();
    }

    const housingCards = document.querySelectorAll('.house-card');
    const housingModal = document.getElementById('housing-modal');
    const housingModalTitle = document.getElementById('housing-modal-title');
    const housingModalBody = document.getElementById('housing-modal-body');
    const housingModalClose = document.getElementById('housing-modal-close');
    const housingStandards = {
      H1: {
        title: '1-bedroom apartment',
        summary: 'Compact urban homes optimised for accessibility, low energy use and digital connection.',
        targetUser: 'Single occupancy / older resident',
        energyRequirement: 'EPC B',
        accessibilityRequirement: 'Step-free access',
        evReadiness: 'Dedicated charge point',
        standards: ['Step-free access to entrances and circulation spaces', 'EV charging point and 100% fibre-ready service connection', 'Low-carbon heating, ventilation and high-efficiency insulation']
      },
      H2: {
        title: '2-bedroom house',
        summary: 'Entry-level family housing designed for efficiency, affordability and resilience.',
        targetUser: 'Small family',
        energyRequirement: 'Net-zero ready',
        accessibilityRequirement: 'Level threshold entry',
        evReadiness: 'Home charging ready',
        standards: ['Heat-pump ready heating and hot water systems', 'Solar-ready roof layout with battery storage allowance', 'Energy performance target aligned with net-zero operating standard']
      },
      H3: {
        title: '3-bedroom family house',
        summary: 'A more spacious family typology for modern living and long-term adaptability.',
        targetUser: 'Growing family',
        energyRequirement: 'Low-carbon standard',
        accessibilityRequirement: 'Flexible circulation',
        evReadiness: 'EV point and load allowance',
        standards: ['Higher space standards with dual-aspect rooms where practical', 'Electrical capacity for smart appliances and future EV charging', 'High-performance insulation, ventilation and thermal comfort controls']
      },
      H4: {
        title: '4-bedroom family house',
        summary: 'Larger family homes designed for multi-generational flexibility and resilient daily use.',
        targetUser: 'Multi-generational household',
        energyRequirement: 'Low energy use / heat pump',
        accessibilityRequirement: 'Adaptable bedrooms',
        evReadiness: 'Garage or driveway charging',
        standards: ['Minimum room depth and daylight standards for core family spaces', 'Enhanced electrical load planning and future charging infrastructure', 'Water, air quality and resilience measures for extended occupancy']
      },
      H5: {
        title: '5-bedroom family house',
        summary: 'Large household homes for growing families and shared occupancy needs.',
        targetUser: 'Large family household',
        energyRequirement: 'Solar + storage ready',
        accessibilityRequirement: 'Wide circulation paths',
        evReadiness: 'Dual EV point provision',
        standards: ['Greater circulation space with adaptable bedroom layouts', 'Smart metering and digital controls for energy monitoring', 'Roof and external envelope designed for solar-ready upgrades']
      },
      H6: {
        title: 'Accessible bungalow',
        summary: 'Single-storey, ageing-well homes built for accessibility, comfort and long-term use.',
        targetUser: 'Ageing residents / disability access',
        energyRequirement: 'Warm homes standard',
        accessibilityRequirement: 'Full wheelchair access',
        evReadiness: 'Optional charge point',
        standards: ['Step-free circulation and widened door thresholds', 'Accessible wet rooms and adaptable bathroom layouts', 'High thermal comfort with robust, low-maintenance materials']
      },
      H7: {
        title: 'Townhouse',
        summary: 'Multi-storey compact family homes that balance density, performance and urban integration.',
        targetUser: 'Urban family',
        energyRequirement: 'High-efficiency fabric',
        accessibilityRequirement: 'Lift-ready core',
        evReadiness: 'Capable for shared charging',
        standards: ['Strong acoustic and fire performance between levels', 'High-efficiency building fabric and low-carbon mechanical systems', 'Fibre, smart heating and communal service resilience']
      },
      H8: {
        title: 'Low-rise apartment',
        summary: 'Efficient apartment living with strong shared amenity and service standards.',
        targetUser: 'City apartment household',
        energyRequirement: 'Building energy performance target',
        accessibilityRequirement: 'Inclusive communal access',
        evReadiness: 'Shared charging infrastructure',
        standards: ['Shared service infrastructure for heating, power and waste systems', 'EV charging provision and strong natural ventilation design', 'Air-quality and acoustic performance within urban settings']
      }
    };

    const housingFilterButtons = document.querySelectorAll('.housing-filter');
    const housingEmptyState = document.querySelector('.housing-library__empty');

    if(housingCards.length && housingModal && housingModalTitle && housingModalBody){
      const openHousingModal = (card) => {
        const key = card.dataset.house || card.querySelector('span')?.textContent;
        const details = housingStandards[key] || {
          title: card.querySelector('h3')?.textContent || 'Housing standard',
          summary: 'Core design requirements for this dwelling type.',
          standards: ['Accessible design and performance-led construction', 'Low-carbon energy systems and resilient materials', 'Future-proofed servicing and digital connectivity']
        };

        housingModalTitle.textContent = details.title;
        housingModalBody.innerHTML = `
          <span class="housing-modal__chip">Housing standard</span>
          <p class="housing-modal__summary">${details.summary}</p>
          <div class="housing-modal__meta">
            <div class="housing-modal__meta-item"><span>Target user</span><strong>${details.targetUser || 'General household'}</strong></div>
            <div class="housing-modal__meta-item"><span>Energy requirement</span><strong>${details.energyRequirement || 'Low-carbon standard'}</strong></div>
            <div class="housing-modal__meta-item"><span>Accessibility</span><strong>${details.accessibilityRequirement || 'Inclusive design'}</strong></div>
            <div class="housing-modal__meta-item"><span>EV readiness</span><strong>${details.evReadiness || 'Ready'}</strong></div>
          </div>
          <ul class="housing-modal__list">
            ${details.standards.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        `;
        housingModal.classList.add('open');
        housingModal.setAttribute('aria-hidden', 'false');
      };

      const closeHousingModal = () => {
        housingModal.classList.remove('open');
        housingModal.setAttribute('aria-hidden', 'true');
      };

      const updateHousingFilterCounts = () => {
        housingFilterButtons.forEach((button) => {
          const filterKey = button.dataset.filter || 'all';
          let count = 0;
          housingCards.forEach((card) => {
            const tags = (card.dataset.tags || '').split(/\s+/).filter(Boolean);
            const matches = filterKey === 'all' || tags.includes(filterKey) || (filterKey === 'ev-ready' && tags.includes('ev-ready'));
            if (matches) {
              count += 1;
            }
          });
          const countEl = button.querySelector('.housing-filter__count');
          if (countEl) countEl.textContent = String(count);
        });
      };

      const applyHousingFilter = (filterKey) => {
        let visibleCount = 0;
        housingCards.forEach((card) => {
          const tags = (card.dataset.tags || '').split(/\s+/).filter(Boolean);
          const shouldShow = filterKey === 'all' || tags.includes(filterKey) || (filterKey === 'ev-ready' && tags.includes('ev-ready'));
          card.style.display = shouldShow ? '' : 'none';
          if (shouldShow) visibleCount += 1;
        });

        if (housingEmptyState) {
          housingEmptyState.hidden = visibleCount !== 0;
        }
      };

      housingFilterButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const filter = button.dataset.filter || 'all';
          housingFilterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
          applyHousingFilter(filter);
        });
      });

      housingCards.forEach((card) => {
        card.addEventListener('click', () => openHousingModal(card));
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openHousingModal(card);
          }
        });
      });

      if(housingModalClose){
        housingModalClose.addEventListener('click', closeHousingModal);
      }

      housingModal.addEventListener('click', (event) => {
        if (event.target === housingModal) closeHousingModal();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && housingModal.classList.contains('open')) {
          closeHousingModal();
        }
      });

      updateHousingFilterCounts();
      applyHousingFilter('all');
    }

    // Map regions: elements with data-region attribute
    const regionPanel = document.getElementById('region-info-panel');
    const regionTitle = document.getElementById('region-info-title');
    const regionBody = document.getElementById('region-info-body');
    const regionCloseBtn = document.getElementById('region-info-close');
    const mapRegions = document.querySelectorAll('.map-region');

    const regionData = {
      Scotland: { total: '£42.8bn', projects: 12, focus: 'Grid resilience', summary: 'National grid upgrades, coastal flood protection, and housing renewal across the Highlands and central belt.' },
      'North East': { total: '£19.4bn', projects: 8, focus: 'Rail and ports', summary: 'Rail electrification, port recovery, and industrial redevelopment programmes are prioritised for Newcastle and Teesside.' },
      'North West': { total: '£31.7bn', projects: 15, focus: 'Water and fibre', summary: 'Water network renewal, digital infrastructure, and housing retrofit programmes dominate the northern corridor.' },
      'Yorkshire & Humber': { total: '£28.6bn', projects: 13, focus: 'Transport hubs', summary: 'Leeds, Sheffield and Hull benefit from integrated transport, public service upgrades and flood protection works.' },
      'East Midlands': { total: '£24.1bn', projects: 10, focus: 'Logistics and flood defence', summary: 'Major logistics corridors, inland flood resilience and local civic recovery investments are planned for the region.' },
      'West Midlands': { total: '£26.5bn', projects: 11, focus: 'Housing and energy', summary: 'A wide housing renewal programme is paired with energy infrastructure expansion and regional transport upgrades.' },
      Wales: { total: '£18.3bn', projects: 9, focus: 'Coastal resilience', summary: "Coastal adaptation, clean energy and community housing projects are shaping Wales' recovery strategy." },
      'East of England': { total: '£22.9bn', projects: 10, focus: 'Digital and flood resilience', summary: 'A dense programme of flood barriers, fibre delivery and public-service reinvestment supports eastern communities.' },
      London: { total: '£37.2bn', projects: 17, focus: 'Utilities and public services', summary: 'London portfolios emphasise utilities upgrades, major transport interchanges and resilient civic services.' },
      'South East': { total: '£35.4bn', projects: 16, focus: 'Ports and housing', summary: 'Growth corridors, port resilience and housing investment are central to the South East strategy.' },
      'South West': { total: '£27.6bn', projects: 12, focus: 'Coastal protection', summary: 'Regional road schemes, coastal defence and energy-modernisation programmes are clustered across the southwest.' }
    };

    function selectRegion(regionEl){
      if(!regionPanel || !regionTitle || !regionBody) return;

      const regionName = regionEl.dataset.region || 'Region';
      const details = regionData[regionName] || {
        total: '£0bn', projects: 0, focus: 'Priority delivery', summary: 'Project data for this region will be added here as the programme expands.'
      };

      mapRegions.forEach((el) => {
        const isSelected = el === regionEl;
        el.classList.toggle('is-active', isSelected);
        el.setAttribute('aria-selected', String(isSelected));
      });

      regionTitle.textContent = regionName;
      regionBody.innerHTML = `
        <span class="region-info-panel__meta">${details.focus}</span>
        <div class="region-info-panel__stats">
          <div><strong>${details.total}</strong><span>Funding</span></div>
          <div><strong>${details.projects}</strong><span>Projects</span></div>
        </div>
        <p>${details.summary}</p>
      `;
      regionPanel.classList.add('visible');
      regionPanel.setAttribute('aria-hidden', 'false');
    }

    if(mapRegions.length){
      mapRegions.forEach((regionEl) => {
        regionEl.addEventListener('click', () => selectRegion(regionEl));
        regionEl.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectRegion(regionEl);
          }
        });
      });

      if(regionCloseBtn){
        regionCloseBtn.addEventListener('click', () => {
          regionPanel.classList.remove('visible');
          regionPanel.setAttribute('aria-hidden', 'true');
          mapRegions.forEach((el) => {
            el.classList.remove('is-active');
            el.setAttribute('aria-selected', 'false');
          });
        });
      }
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();