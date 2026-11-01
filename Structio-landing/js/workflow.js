/**
 * STRUCTIO® — Interactive Workflow Engine
 * Real-time 6-Stage Operational Pipeline Simulator
 * ENQUIRY → QUALIFICATION → ORGANISATION → RESPONSE → HUMAN HANDOVER → FOLLOW-UP
 */

(function () {
  'use strict';

  const WORKFLOW_STAGES = [
    {
      id: 'enquiry',
      index: '01',
      name: 'Enquiry',
      title: 'Multichannel Inbound Capture',
      badge: 'INTAKE PROTOCOL',
      latency: '+0.8s from submission',
      desc: 'The incoming property enquiry is captured instantaneously from WhatsApp, Property24, Private Property or custom webhooks. No manual copy-pasting, no lost portal notifications.',
      specs: [
        { key: 'Source Channel', val: 'WhatsApp Business API' },
        { key: 'Ingestion Latency', val: '0.84 seconds' },
        { key: 'Payload Verification', val: 'HMAC SHA-256 Passed' },
        { key: 'Deduplication Status', val: 'Unique prospect confirmed' }
      ],
      chat: [
        {
          type: 'inbound',
          text: 'Hi there, I saw the 3-bed townhouse in Morningside, Sandton listed on Property24 for R3.85M. Is it still available to view this weekend?',
          time: '14:02'
        }
      ],
      payload: {
        event: "inbound_enquiry_received",
        channel: "whatsapp_direct",
        prospect: {
          phone_e164: "+27 82 459 9120",
          name_extracted: "Kabelo Mokoena",
          country: "ZA"
        },
        listing_ref: "STR-MORN-402",
        price_zar: 3850000,
        suburb: "Morningside, Sandton",
        initial_status: "captured_pending_eval"
      }
    },
    {
      id: 'qualification',
      index: '02',
      name: 'Qualification',
      title: 'Conversational AI Qualification',
      badge: 'DYNAMIC EVALUATION',
      latency: '+4.2s response time',
      desc: 'Intelligent AI initiates an authentic conversation to establish pre-approval status, purchase timeline, cash vs. bond, and specific property criteria according to agency parameters.',
      specs: [
        { key: 'AI Reasoning Engine', val: 'Structio RE-Logic v2.1' },
        { key: 'Context Window', val: 'Property inventory + Agency guidelines' },
        { key: 'Qualification Depth', val: 'Budget, Financing, Timeline' },
        { key: 'Hallucination Guard', val: 'Strict parameter bounds' }
      ],
      chat: [
        {
          type: 'inbound',
          text: 'Hi there, I saw the 3-bed townhouse in Morningside, Sandton listed on Property24 for R3.85M. Is it still available to view this weekend?',
          time: '14:02'
        },
        {
          type: 'system-ai',
          text: 'Good afternoon Kabelo, thanks for reaching out! Yes, 14 The Terraces in Morningside is currently available. We have private viewing slots open this Saturday between 11:00 and 14:00. Are you looking to purchase with pre-approved bond financing or as a cash buyer?',
          time: '14:02'
        },
        {
          type: 'inbound',
          text: 'We have pre-approval in place with Standard Bank up to R4.2M, looking to move before December.',
          time: '14:03'
        }
      ],
      payload: {
        lead_id: "STR-ZA-2026-8819",
        qualification_tier: "A_HIGH_INTENT",
        extracted_criteria: {
          budget_ceiling_zar: 4200000,
          financing_type: "pre_approved_bond",
          lender: "Standard Bank",
          move_in_timeline: "Under 60 days (Q4 2026)",
          decision_maker: true
        },
        confidence_score: 0.96
      }
    },
    {
      id: 'organisation',
      index: '03',
      name: 'Organisation',
      title: 'CRM Record Structuring & Enrichment',
      badge: 'DATABASE ARCHITECTURE',
      latency: '+1.1s database write',
      desc: 'The qualified lead is automatically parsed, formatted, and written into the agency CRM or structured database. Custom fields, tags, and audit trails are populated automatically.',
      specs: [
        { key: 'CRM Destination', val: 'Custom CRM / Basecamp / Database' },
        { key: 'Field Mapping', val: '14 automated parameters' },
        { key: 'Deduplication Policy', val: 'Phone & Email cross-checked' },
        { key: 'Lead Scoring', val: '94 / 100 (Tier 1)' }
      ],
      chat: [
        {
          type: 'inbound',
          text: 'We have pre-approval in place with Standard Bank up to R4.2M, looking to move before December.',
          time: '14:03'
        },
        {
          type: 'system-ai',
          text: 'That is fantastic Kabelo. I have noted your pre-approval with Standard Bank and your December timeline. Let me connect you directly with David, our area specialist for Morningside, to confirm your Saturday slot.',
          time: '14:03'
        }
      ],
      payload: {
        crm_record_created: {
          id: "REC-99402",
          full_name: "Kabelo Mokoena",
          contact_number: "+27 82 459 9120",
          target_suburb: "Morningside, Sandton",
          price_range: "R3.8M - R4.2M",
          finance_status: "Verified Pre-Approved",
          stage: "Ready for Human Handover",
          tags: ["Sandton-Buyer", "Bond-Ready", "Immediate-Action"]
        }
      }
    },
    {
      id: 'response',
      index: '04',
      name: 'Response',
      title: 'Immediate Tailored Communication',
      badge: 'AUTOMATED DISPATCH',
      latency: '+0.5s notification dispatch',
      desc: 'Prospect receives a helpful, contextual WhatsApp message confirming next steps while the assigned agent is briefed with a complete situational dossier.',
      specs: [
        { key: 'Response Window', val: 'Sub-60 seconds guaranteed' },
        { key: 'Attachment Delivery', val: 'Brochure PDF + Floorplan sent' },
        { key: 'Agent Dossier', val: 'Dispatched to David via internal alert' },
        { key: 'Communication Tone', val: 'Warm, professional, non-robotic' }
      ],
      chat: [
        {
          type: 'system-ai',
          text: 'David has received your file along with the property floor plan. He will take over here shortly to finalize Saturday morning. Here is the official property sheet in the meantime.',
          time: '14:04'
        },
        {
          type: 'system-ai',
          text: '📄 [Floorplan_14_Terraces_Morningside.pdf — 1.8 MB]',
          time: '14:04'
        }
      ],
      payload: {
        dispatch_status: "delivered",
        collateral_sent: ["property_brochure_pdf", "floorplan_v1"],
        agent_notification: {
          recipient: "David_Vermeulen_LeadAgent",
          priority: "HIGH_URGENT",
          brief: "Pre-approved R4.2M buyer requesting Saturday viewing for 14 The Terraces."
        }
      }
    },
    {
      id: 'human-handover',
      index: '05',
      name: 'Human Handover',
      title: 'Seamless Salesperson Transition',
      badge: 'HUMAN-IN-THE-LOOP',
      latency: 'Instant agent notification',
      desc: 'The salesperson takes over the live conversation with full context. No asking repetitive questions, no awkward handoffs. AI steps into silent monitoring mode.',
      specs: [
        { key: 'Agent Action', val: 'David Vermeulen assumed chat' },
        { key: 'Context Briefing', val: '100% historical context preserved' },
        { key: 'AI Mode', val: 'Silent / Advisory standby' },
        { key: 'Customer Experience', val: 'Continuous, frictionless' }
      ],
      chat: [
        {
          type: 'agent-human',
          text: 'Hi Kabelo, David here from the Morningside team! Thanks for getting in touch. 11:30 this Saturday works perfectly for 14 The Terraces. I’ll meet you at the main gate. I will also bring along keys for unit 8 just in case you want to compare layouts.',
          time: '14:06'
        },
        {
          type: 'inbound',
          text: 'Perfect David, see you Saturday at 11:30. Appreciate the fast response!',
          time: '14:07'
        }
      ],
      payload: {
        conversation_state: "human_active",
        assigned_agent: "David Vermeulen (Senior Associate)",
        ai_presence: "silent_listener",
        scheduled_meeting: {
          date: "2026-11-07",
          time: "11:30 SAST",
          location: "14 The Terraces, Morningside"
        }
      }
    },
    {
      id: 'follow-up',
      index: '06',
      name: 'Follow-Up',
      title: 'Persistent Follow-Up Infrastructure',
      badge: 'OPPORTUNITY RETENTION',
      latency: 'Automated cadence active',
      desc: 'If viewing is concluded or if a lead goes silent, automated reminder cadences activate to keep the conversation warm and ensure no prospective transaction falls through the cracks.',
      specs: [
        { key: 'Trigger Event', val: 'Post-viewing feedback / No-response' },
        { key: 'Cadence Interval', val: '24h, 72h, 7-day gentle checkpoints' },
        { key: 'CRM Status Update', val: 'Synced with agent pipeline' },
        { key: 'Drop-off Prevention', val: '99.4% conversation retention' }
      ],
      chat: [
        {
          type: 'agent-human',
          text: 'Hi Kabelo, great meeting you and your wife on Saturday! What did you think of the master suite and the private terrace at unit 14?',
          time: 'Sun 10:15'
        },
        {
          type: 'inbound',
          text: 'Hi David! We loved unit 14. We want to discuss putting in an offer this evening.',
          time: 'Sun 10:48'
        }
      ],
      payload: {
        lifecycle_stage: "offer_discussion_pending",
        follow_up_cadence: "post_viewing_check_complete",
        lead_retention_flag: "ACTIVE_TRANSACTION",
        crm_deal_created: {
          value_zar: 3850000,
          probability: "85%",
          closing_window: "November 2026"
        }
      }
    }
  ];

  let currentStageIndex = 0;
  let autoplayInterval = null;

  function initWorkflow() {
    renderStage(0);
    bindEvents();
  }

  function bindEvents() {
    const stepBtns = document.querySelectorAll('.workflow-step-btn');
    stepBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        setStage(index);
        stopAutoplay();
      });
    });

    const nextBtn = document.getElementById('workflow-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = (currentStageIndex + 1) % WORKFLOW_STAGES.length;
        setStage(next);
        stopAutoplay();
      });
    }

    const prevBtn = document.getElementById('workflow-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prev = (currentStageIndex - 1 + WORKFLOW_STAGES.length) % WORKFLOW_STAGES.length;
        setStage(prev);
        stopAutoplay();
      });
    }
  }

  function setStage(index) {
    currentStageIndex = index;
    renderStage(index);
  }

  function renderStage(index) {
    const stage = WORKFLOW_STAGES[index];
    if (!stage) return;

    // Update Step Buttons
    const stepBtns = document.querySelectorAll('.workflow-step-btn');
    stepBtns.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update Narrative Panel
    const badgeEl = document.getElementById('wf-stage-badge');
    const latencyEl = document.getElementById('wf-stage-latency');
    const titleEl = document.getElementById('wf-stage-title');
    const descEl = document.getElementById('wf-stage-desc');
    const breakdownEl = document.getElementById('wf-stage-breakdown');

    if (badgeEl) badgeEl.textContent = stage.badge;
    if (latencyEl) latencyEl.textContent = stage.latency;
    if (titleEl) titleEl.textContent = stage.title;
    if (descEl) descEl.textContent = stage.desc;

    if (breakdownEl) {
      breakdownEl.innerHTML = stage.specs.map(s => `
        <div class="breakdown-row">
          <span class="breakdown-key">${s.key}</span>
          <span class="breakdown-val">${s.val}</span>
        </div>
      `).join('');
    }

    // Update Chat Simulator
    const chatContainer = document.getElementById('wf-chat-messages');
    if (chatContainer) {
      chatContainer.innerHTML = stage.chat.map(m => `
        <div class="chat-bubble ${m.type}">
          <div>${m.text}</div>
          <div class="bubble-meta">
            <span>${m.time}</span>
            ${m.type !== 'inbound' ? '<span>✓✓</span>' : ''}
          </div>
        </div>
      `).join('');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Update JSON Data Inspector
    const payloadContainer = document.getElementById('wf-payload-content');
    if (payloadContainer) {
      payloadContainer.textContent = JSON.stringify(stage.payload, null, 2);
    }
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  window.StructioWorkflow = {
    init: initWorkflow,
    setStage: setStage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkflow);
  } else {
    initWorkflow();
  }
})();
