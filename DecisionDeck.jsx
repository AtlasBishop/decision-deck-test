import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Circle, ChevronRight, ChevronDown, AlertCircle, Target, TrendingUp, Sparkles, Users, Zap, FileText, BarChart3, Calendar, UserPlus, Info, Clock, ArrowRight } from 'lucide-react';

const DecisionDeck = () => {
  const [expandedLayers, setExpandedLayers] = useState({});
  const [expandedFog, setExpandedFog] = useState(false);
  const [expandedKP, setExpandedKP] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [aiView, setAiView] = useState('executive');
  const [editMode, setEditMode] = useState(true);
  const [showNote, setShowNote] = useState(null);
  const [showAssignee, setShowAssignee] = useState(null);
  const [showPrintView, setShowPrintView] = useState(false);
  
  const [requirementStatuses, setRequirementStatuses] = useState({});
  const [requirementNotes, setRequirementNotes] = useState({});
  const [requirementAssignees, setRequirementAssignees] = useState({});
  const [fogStatuses, setFogStatuses] = useState({});

  const handleExportPDF = () => {
    alert('📄 TO SAVE AS PDF:\n\n1. Press Ctrl+P (Windows/Linux) or Cmd+P (Mac)\n2. Select "Save as PDF" as destination\n3. Click Save\n\nThe page is already optimized for printing!\n\nNote: Due to browser sandbox restrictions, we cannot auto-trigger the print dialog.');
  };

  useEffect(() => {
    if (showPrintView) {
      const timer = setTimeout(() => {
        console.log('Print view ready - use Ctrl+P or Cmd+P to print');
        setShowPrintView(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showPrintView]);
  
  const toggleLayer = (layerId) => {
    setExpandedLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const cycleStatus = (id) => {
    if (!editMode) return;
    const currentStatus = requirementStatuses[id] || 'good';
    const statusCycle = { 'good': 'work', 'work': 'some', 'some': 'good' };
    setRequirementStatuses(prev => ({
      ...prev,
      [id]: statusCycle[currentStatus]
    }));
  };

  const cycleFogStageStatus = (assetName, stage) => {
    if (!editMode) return;
    const key = `${assetName}-${stage}`;
    const currentStatus = fogStatuses[key] || 'some';
    const statusCycle = { 'good': 'work', 'work': 'some', 'some': 'good' };
    setFogStatuses(prev => ({
      ...prev,
      [key]: statusCycle[currentStatus]
    }));
  };

  const addNote = (id, note) => {
    setRequirementNotes(prev => ({
      ...prev,
      [id]: note
    }));
    setShowNote(null);
  };

  const addAssignee = (id, assignee) => {
    setRequirementAssignees(prev => ({
      ...prev,
      [id]: assignee
    }));
    setShowAssignee(null);
  };

  const getStatus = (id, defaultStatus) => {
    return requirementStatuses[id] || defaultStatus;
  };

  const getFogStageStatus = (assetName, stage) => {
    return fogStatuses[`${assetName}-${stage}`] || 'some';
  };

  const getStatusIcon = (status, clickable = false) => {
    const iconClass = clickable ? 'cursor-pointer hover:scale-110 transition-transform' : '';
    if (status === 'good') {
      return <CheckCircle className={`w-5 h-5 text-green-500 ${iconClass}`} />;
    }
    if (status === 'work') {
      return <XCircle className={`w-5 h-5 text-red-500 ${iconClass}`} />;
    }
    if (status === 'some') {
      return <Circle className={`w-5 h-5 text-yellow-500 ${iconClass}`} />;
    }
    return <Circle className={`w-5 h-5 text-gray-400 ${iconClass}`} />;
  };

  const getStatusColor = (status) => {
    if (status === 'good') return 'bg-green-500';
    if (status === 'work') return 'bg-red-500';
    if (status === 'some') return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const calculateLayerCompletion = (requirements, layerId) => {
    const total = requirements.length;
    const completed = requirements.filter((req, idx) => {
      const status = getStatus(`${layerId}-${idx}`, req.status);
      return status === 'good';
    }).length;
    return Math.round((completed / total) * 100);
  };

  const calculateOverallScore = () => {
    let totalReqs = 0;
    let completedReqs = 0;
    
    layers.forEach(layer => {
      layer.requirements.forEach((req, idx) => {
        totalReqs++;
        const status = getStatus(`${layer.id}-${idx}`, req.status);
        if (status === 'good') completedReqs++;
      });
    });
    
    return Math.round((completedReqs / totalReqs) * 100);
  };

  const getNextActions = () => {
    const actions = [];
    layers.forEach(layer => {
      layer.requirements.forEach((req, idx) => {
        const status = getStatus(`${layer.id}-${idx}`, req.status);
        if (status !== 'good') {
          actions.push({
            layer: layer.name,
            requirement: req.name,
            status: status,
            priority: status === 'work' ? 'high' : 'medium'
          });
        }
      });
    });
    return actions.slice(0, 5);
  };

  const layers = [
    {
      id: 'direction',
      level: 1,
      name: 'DIRECTION',
      subtitle: 'Company Context Level',
      question: 'Who are we, and where are we going?',
      color: 'bg-red-600',
      gateQuestion: 'Is the Company CODE established?',
      requirements: [
        { 
          name: 'PMV articulated (Purpose, Mission, Vision)', 
          status: 'good',
          what: 'The core identity and direction',
          why: 'Without this, no one knows who we are or where we are heading'
        },
        { 
          name: 'FLAG defined (what we stand for)', 
          status: 'good',
          what: 'Our rallying point and differentiator',
          why: 'This is what makes us unique and worth following'
        },
        { 
          name: 'AI Setup protocols configured', 
          status: 'work',
          what: 'First principles rules for the system',
          why: 'Ensures the AI operates in alignment with company CODE'
        }
      ],
      action: 'If NO then STOP. Work on CODE first. If YES then Proceed to Cultural Engine',
      onMissionComponent: 'Foundation Readiness',
      hasFog: true
    },
    {
      id: 'cultural',
      level: 2,
      name: 'CULTURAL ENGINE',
      subtitle: 'Company Dynamics',
      question: 'Who are we and why do we exist?',
      color: 'bg-purple-600',
      gateQuestion: 'All 4 subfields are established by the leadership team',
      requirements: [
        { 
          name: 'Values + Standards Established & Documented', 
          status: 'work',
          what: 'Our guardrails and non-negotiables',
          why: 'These constrain behavior and create focus'
        },
        { 
          name: 'Tools & Training identified (Dynamic Tools, Time Matrix, Mental Skills, Diagnostics)', 
          status: 'work',
          what: 'Mental models and frameworks',
          why: 'Equips people with ways to think and operate'
        },
        { 
          name: 'Talent and Recruitment framework ready', 
          status: 'work',
          what: 'How we attract and select people',
          why: 'Gets the right people in the right seats'
        },
        { 
          name: 'Company Structure + Team Makeup & Mapping', 
          status: 'work',
          what: 'How we organize',
          why: 'Defines roles, responsibilities, and relationships'
        }
      ],
      action: 'Cultural Coherence drives alignment',
      onMissionComponent: 'Cultural Coherence %'
    },
    {
      id: 'commercial',
      level: 3,
      name: 'COMMERCIAL ENGINE',
      subtitle: 'Company Mechanics',
      question: 'How do we operate?',
      color: 'bg-blue-600',
      gateQuestion: 'Top 2 subfields are completed',
      requirements: [
        { 
          name: 'Strategic Objectives defined', 
          status: 'good',
          what: 'Our high-level goals',
          why: 'Sets direction for the entire organization'
        },
        { 
          name: 'Targets Setup & Role/User Association', 
          status: 'good',
          what: 'Measurable outcomes',
          why: 'Gives clarity on what success looks like'
        },
        { 
          name: 'Ops Engine (APIs) connected', 
          status: 'some',
          what: 'System integrations',
          why: 'Connects tools and automates workflows'
        },
        { 
          name: 'Skill Matrix', 
          status: 'work',
          what: 'Competency mapping',
          why: 'Identifies gaps and development needs'
        },
        { 
          name: 'Key SOPs + tactics documented', 
          status: 'some',
          what: 'Standard operating procedures',
          why: 'Ensures consistency and quality'
        }
      ],
      action: 'Operational mechanics enable execution',
      onMissionComponent: 'Operational Readiness %'
    },
    {
      id: 'user',
      level: 4,
      name: 'USER ONBOARDING',
      subtitle: 'Team members, managers and leaders',
      question: 'Do I understand my role in the mission?',
      color: 'bg-teal-600',
      gateQuestion: 'All users onboarded and had their 1:1 with their leader',
      requirements: [
        { 
          name: 'My CODE Established (Mission clarity, Values internalized)', 
          status: 'good',
          what: 'Personal interpretation of company CODE',
          why: 'Creates individual alignment with organizational identity'
        },
        { 
          name: 'My Context Mapped (User type, Team, BIO and Life Events)', 
          status: 'good',
          what: 'Role, team, and personal context',
          why: 'Positions you within the larger system'
        },
        { 
          name: 'My Targets Set (Position and Role, Conflict resolution, Key targets)', 
          status: 'work',
          what: 'Individual goals and responsibilities',
          why: 'Clarifies your specific contribution'
        },
        { 
          name: 'My Tools Activated (Feedback, Overvier, Activity Log)', 
          status: 'work',
          what: 'Personal dashboard and feedback systems',
          why: 'Enables self-management and growth'
        }
      ],
      action: 'Individual alignment creates collective momentum',
      onMissionComponent: 'Individual Alignment %'
    },
    {
      id: 'execution',
      level: 5,
      name: 'EXECUTION',
      subtitle: 'Weekly Focus',
      question: 'What matters THIS WEEK?',
      color: 'bg-green-600',
      gateQuestion: 'What are the Key Practices and Key Actions?',
      requirements: [
        { 
          name: 'My Focus Dashboard active', 
          status: 'good',
          what: 'Real-time view of priorities',
          why: 'Keeps you focused on what matters most'
        },
        { 
          name: 'Key Practices identified (high-leverage activities)', 
          status: 'good',
          what: 'High-leverage activities',
          why: 'Maximizes impact of your time'
        },
        { 
          name: 'Key Actions defined (specific enablers & deadline items)', 
          status: 'good',
          what: 'Specific tasks this week',
          why: 'Translates strategy into execution'
        },
        { 
          name: 'Weekly OnMission Score calculated', 
          status: 'good',
          what: 'Aggregate alignment measure',
          why: 'Provides feedback on organizational health'
        }
      ],
      action: 'Weekly focus drives measurable progress',
      onMissionComponent: 'Weekly Execution Score',
      hasKP: true
    }
  ];

  const fogAssets = [
    { name: 'VISION', type: 'intangible', description: 'The highest revenue generating asset. Your big vision that orients everyone toward a common direction.' },
    { name: 'CULTURE', type: 'intangible', description: 'The manner in which everyone operates. Defined by Values - the constraints that create focus.' },
    { name: 'BEHAVIOUR', type: 'intangible', description: 'Upheld by Standards - non-negotiable actions that must be taken regardless of emotional state.' },
    { name: 'XYZ', type: 'intangible', description: 'Your positioning in the marketplace. X Factor, Why people stop, Zag when others Zig.' },
    { name: 'STOP', type: 'tangible', description: 'Solution To Problem. What makes people stop and think about what you offer.' },
    { name: 'NETWORK', type: 'tangible', description: 'Your customers are your greatest salesforce. Get one person talking to another about your product.' },
    { name: 'SALES', type: 'tangible', description: 'A journey powered by networks. Use the people who know you and have heard about you.' },
    { name: 'DELIVERY', type: 'tangible', description: 'Follow through on your promise. Not delivering will kill your business faster than anything.' }
  ];

  const ideaStages = ['IDEA', 'DESIGN', 'EDUCATE', 'ACTION'];

  const decisionLogic = [
    { range: 'Less than 60%', focus: 'Focus on supporting users with basics & reminders. Inform Leader user X needs support. Inform high scoring team members a fellow member needs help.', color: 'text-red-600' },
    { range: '61% to 85%', focus: 'Focus on completed reflections and incomplete dashboard items', color: 'text-yellow-600' },
    { range: 'Above 85%', focus: 'Focus on insights and the whole profile of the user. Get feedback from them + ensure user is getting feedback.', color: 'text-green-600' }
  ];

  const timingRules = [
    'Early Week Check-in: Send a brief, positive message by Tuesday morning highlighting the week\'s focus areas.',
    'Mid-Week Progress: If completion is below 50% by Wednesday afternoon, send a gentle reminder.',
    'Friday Morning Reminder: For anyone below 85% completion, send a supportive nudge.',
    'End-of-Week Recognition: Send congratulatory messages to everyone who reaches 100%.',
    'Limit Contact: Never send more than two prompts per day regardless of status.',
    'Respect Time Boundaries: Avoid sending messages outside standard business hours unless specifically configured otherwise.'
  ];

  const executiveInsights = [
    { icon: '🎯', title: 'PRIORITY FOCUS', subtitle: 'Resource Allocation Intelligence', description: 'Helps executives decide WHERE to deploy limited resources', question: 'What should I focus my team on RIGHT NOW?' },
    { icon: '📈', title: 'TREND', subtitle: 'Performance Validation', description: 'Builds confidence in current strategies by showing momentum', question: 'Is what we\'re doing actually working?' },
    { icon: '⚡', title: 'ACTION NEEDED', subtitle: 'Urgent Tactical Decisions', description: 'Flags time-sensitive decisions that need executive intervention', question: 'What will fail if I don\'t act this week?' },
    { icon: '🚀', title: 'OPPORTUNITY', subtitle: 'Growth Expansion Thinking', description: 'Identifies where you\'re ahead of plan or market conditions favor acceleration', question: 'Where should I double down or accelerate investment?' },
    { icon: '⚠️', title: 'RISK ALERT', subtitle: 'Threat Mitigation', description: 'Early warning system for things that could derail objectives', question: 'What could blindside us if we ignore it?' },
    { icon: '🔬', title: 'RESEARCH INSIGHT', subtitle: 'Validation & Confidence Building', description: 'External validation that reduces uncertainty in decision-making', question: 'Are we on the right track compared to best practices?' }
  ];

  const frontlineInsights = [
    { icon: '🎯', title: 'YOUR NEXT STEP', description: 'Based on your targets, here\'s exactly what to work on next' },
    { icon: '💪', title: 'QUICK WIN', description: 'Here\'s something you can complete today that will make real impact' },
    { icon: '🤝', title: 'COLLABORATION NUDGE', description: 'You should connect with Sarah from Clinical about your partnership target' },
    { icon: '📚', title: 'SKILL SPOTLIGHT', description: 'Your targets suggest you\'d benefit from conflict resolution training' },
    { icon: '⏰', title: 'EFFICIENCY TIP', description: 'You\'re spending too much time on X - here\'s a better approach' },
    { icon: '🔧', title: 'PROCESS HACK', description: 'Teams using this method are 30% faster at client intake' },
    { icon: '📈', title: 'MOMENTUM CHECK', description: 'You\'re ahead of schedule on clinical protocols - great work!' },
    { icon: '🎉', title: 'CELEBRATION', description: 'You just hit a major milestone - here\'s why it matters' },
    { icon: '❓', title: 'GET HELP', description: 'Stuck on NPS targets? Here\'s who can help and how to ask' },
    { icon: '🔍', title: 'TODAY\'S FOCUS', description: 'Of your 5 targets, these 2 need attention this week' }
  ];

  const overallScore = calculateOverallScore();
  const potentialGain = 100 - overallScore;
  const nextActions = getNextActions();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style>{`
        @media print {
          body { margin: 0; padding: 20px; background: white; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .page-break { page-break-after: always; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>

      {showPrintView && (
        <div className="print-only bg-white p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OnMission: Direction & Destiny Decision Deck</h1>
            <p className="text-lg text-gray-600">Readiness & Alignment Diagnostic Report</p>
            <p className="text-sm text-gray-500 mt-2">{new Date().toLocaleDateString()}</p>
          </div>

          <div className="mb-8 p-6 border-2 border-blue-500 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Status</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">{overallScore}%</div>
                <div className="text-sm text-gray-600">OnMission Score</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-orange-600 mb-2">+{potentialGain}%</div>
                <div className="text-sm text-gray-600">Potential Performance Gain</div>
              </div>
            </div>
          </div>

          {layers.map((layer, layerIdx) => (
            <div key={layer.id} className={`mb-8 ${layerIdx > 0 && layerIdx % 2 === 0 ? 'page-break' : ''}`}>
              <div className={`${layer.color} text-white p-4 rounded-t-lg`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold opacity-75 mb-1">LAYER {layer.level}</div>
                    <h2 className="text-2xl font-bold">{layer.name}</h2>
                    <p className="text-sm opacity-90">{layer.subtitle}</p>
                  </div>
                  <div className="text-3xl font-bold">{calculateLayerCompletion(layer.requirements, layer.id)}%</div>
                </div>
              </div>
              <div className="border-2 border-gray-200 rounded-b-lg p-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                  <p className="font-bold text-gray-900 text-sm">Decision Gate:</p>
                  <p className="text-gray-700 text-sm">{layer.gateQuestion}</p>
                </div>
                <div className="space-y-2">
                  {layer.requirements.map((req, idx) => {
                    const reqId = `${layer.id}-${idx}`;
                    const currentStatus = getStatus(reqId, req.status);
                    const statusText = currentStatus === 'good' ? '✓ GOOD' : currentStatus === 'work' ? '✗ LOTS OF WORK' : '◯ SOME WORK';
                    const assignee = requirementAssignees[reqId];
                    const note = requirementNotes[reqId];
                    return (
                      <div key={idx} className="border border-gray-200 p-3 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <span className={`font-bold text-sm ${currentStatus === 'good' ? 'text-green-600' : currentStatus === 'work' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {statusText}
                            </span>
                            <span className="text-gray-900 font-medium text-sm ml-2">{req.name}</span>
                          </div>
                          {assignee && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{assignee}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p><span className="font-semibold">What:</span> {req.what}</p>
                          <p><span className="font-semibold">Why:</span> {req.why}</p>
                          {note && (
                            <p className="bg-blue-50 p-2 rounded mt-2"><span className="font-semibold">Note:</span> {note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className="page-break"></div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Priority Actions</h2>
            <div className="space-y-2">
              {nextActions.map((action, idx) => (
                <div key={idx} className="border border-gray-200 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="text-xs font-semibold text-gray-500">{action.layer}</div>
                    <div className="text-sm text-gray-900">{action.requirement.split('(')[0].trim()}</div>
                  </div>
                  <span className={`text-xs font-bold ${action.status === 'work' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {action.status === 'work' ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto no-print">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Direction & Destiny Decision Deck</h1>
              <p className="text-lg text-gray-600">OnMission: Readiness and Alignment Diagnostic</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-white rounded-lg shadow px-4 py-2 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={editMode}
                  onChange={(e) => setEditMode(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Edit Mode</span>
              </div>
              <button 
                onClick={handleExportPDF}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded ${activeView === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Detail View
            </button>
            <button 
              onClick={() => setActiveView('timeline')}
              className={`px-4 py-2 rounded ${activeView === 'timeline' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setActiveView('logic')}
              className={`px-4 py-2 rounded ${activeView === 'logic' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Decision Logic
            </button>
            <button 
              onClick={() => setActiveView('ai')}
              className={`px-4 py-2 rounded ${activeView === 'ai' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              AI Insights
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">GOOD</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">LOTS OF WORK</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">SOME WORK</span>
          </div>
        </div>

        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">OnMission Score</h2>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-48 h-48">
                    <svg className="transform -rotate-90" width="192" height="192">
                      <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="80" 
                        stroke={overallScore >= 85 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="16" 
                        fill="none"
                        strokeDasharray={`${(overallScore / 100) * 502.65} 502.65`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-gray-900">{overallScore}%</span>
                      <span className="text-sm text-gray-500">Complete</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">+{potentialGain}%</div>
                  <div className="text-sm text-gray-600">Potential Performance Gain</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Top Priority Actions</h2>
                <div className="space-y-3">
                  {nextActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                      <div className={`w-2 h-2 rounded-full mt-2 ${action.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500">{action.layer}</div>
                        <div className="text-sm text-gray-900">{action.requirement.split('(')[0].trim()}</div>
                      </div>
                      {getStatusIcon(action.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Layer Completion</h2>
              <div className="space-y-4">
                {layers.map((layer) => {
                  const completion = calculateLayerCompletion(layer.requirements, layer.id);
                  return (
                    <div key={layer.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-500">L{layer.level}</span>
                          <span className="text-sm font-medium text-gray-700">{layer.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${layer.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Readiness Heatmap</h2>
              <div className="grid grid-cols-5 gap-4">
                {layers.map((layer) => (
                  <div key={layer.id} className="space-y-2">
                    <div className="text-xs font-bold text-gray-700 text-center">{layer.name}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {layer.requirements.map((req, idx) => {
                        const status = getStatus(`${layer.id}-${idx}`, req.status);
                        return (
                          <div 
                            key={idx}
                            className={`${getStatusColor(status)} h-12 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                            title={req.name}
                            onClick={() => cycleStatus(`${layer.id}-${idx}`)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'timeline' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Implementation Timeline</h2>
            <div className="space-y-8">
              {layers.map((layer, layerIdx) => (
                <div key={layer.id} className="relative">
                  {layerIdx > 0 && (
                    <div className="absolute left-6 -top-4 w-0.5 h-8 bg-gray-300" />
                  )}
                  <div className="flex items-start gap-6">
                    <div className={`w-12 h-12 ${layer.color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {layer.level}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{layer.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{layer.subtitle}</p>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                        <p className="text-sm font-semibold text-blue-900">Decision Gate: {layer.gateQuestion}</p>
                      </div>
                      <div className="space-y-2">
                        {layer.requirements.map((req, idx) => {
                          const status = getStatus(`${layer.id}-${idx}`, req.status);
                          return (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              {getStatusIcon(status)}
                              <span className="text-gray-700">{req.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{calculateLayerCompletion(layer.requirements, layer.id)}%</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                  {layerIdx < layers.length - 1 && (
                    <div className="ml-6 mt-4 flex items-center gap-2 text-gray-500">
                      <ArrowRight className="w-5 h-5" />
                      <span className="text-sm">Then proceed to Layer {layer.level + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'overview' && (
          <div className="space-y-4">
            {layers.map((layer) => (
              <div key={layer.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div 
                  className={`${layer.color} text-white p-6 cursor-pointer`}
                  onClick={() => toggleLayer(layer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold opacity-75">LAYER {layer.level}</span>
                        {expandedLayers[layer.id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                      <h2 className="text-2xl font-bold mt-1">{layer.name}</h2>
                      <p className="text-sm opacity-90 mt-1">{layer.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-xl italic">{layer.question}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold">{calculateLayerCompletion(layer.requirements, layer.id)}%</div>
                        <div className="text-xs opacity-75">Complete</div>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedLayers[layer.id] && (
                  <div className="p-6">
                    <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-gray-900">Decision Gate:</p>
                          <p className="text-gray-700 mt-1">{layer.gateQuestion}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {layer.requirements.map((req, idx) => {
                        const reqId = `${layer.id}-${idx}`;
                        const currentStatus = getStatus(reqId, req.status);
                        return (
                          <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded border border-gray-200">
                            <div onClick={() => cycleStatus(reqId)}>
                              {getStatusIcon(currentStatus, editMode)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <p className="text-gray-900 font-medium flex-1">{req.name}</p>
                                <div className="flex items-center gap-2">
                                  {requirementAssignees[reqId] && (
                                    <div className="px-2 py-1 bg-purple-100 rounded text-xs font-medium text-purple-700">
                                      {requirementAssignees[reqId]}
                                    </div>
                                  )}
                                  {requirementNotes[reqId] && (
                                    <div className="relative group">
                                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 cursor-pointer">
                                        n
                                      </div>
                                      <div className="absolute right-0 top-8 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-lg hidden group-hover:block z-10">
                                        {requirementNotes[reqId]}
                                      </div>
                                    </div>
                                  )}
                                  {editMode && (
                                    <>
                                      <button 
                                        onClick={() => setShowAssignee(showAssignee === reqId ? null : reqId)}
                                        className="text-purple-600 hover:text-purple-800"
                                        title="Assign owner"
                                      >
                                        <UserPlus className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => setShowNote(showNote === reqId ? null : reqId)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Add note"
                                      >
                                        <FileText className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                              {showAssignee === reqId && (
                                <div className="mt-3">
                                  <input 
                                    type="text"
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Enter assignee name..."
                                    onBlur={(e) => addAssignee(reqId, e.target.value)}
                                    defaultValue={requirementAssignees[reqId] || ''}
                                  />
                                </div>
                              )}
                              {showNote === reqId && (
                                <div className="mt-3">
                                  <textarea 
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Add a note..."
                                    rows="3"
                                    onBlur={(e) => addNote(reqId, e.target.value)}
                                    defaultValue={requirementNotes[reqId] || ''}
                                  />
                                </div>
                              )}
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-blue-700"><span className="font-semibold">What:</span> {req.what}</p>
                                <p className="text-sm text-purple-700"><span className="font-semibold">Why:</span> {req.why}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {layer.hasFog && (
                      <div className="mb-6">
                        <div 
                          className="bg-gradient-to-r from-orange-50 to-blue-50 border-2 border-orange-300 rounded-lg p-5 cursor-pointer"
                          onClick={() => setExpandedFog(!expandedFog)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Target className="w-6 h-6 text-orange-600" />
                              <h3 className="text-xl font-bold text-gray-900">FOG Diagnostic</h3>
                            </div>
                            {expandedFog ? <ChevronDown className="w-6 h-6 text-orange-600" /> : <ChevronRight className="w-6 h-6 text-orange-600" />}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Foundations Of Growth - Business Growth Framework with IDEA Stages</p>
                        </div>

                        {expandedFog && (
                          <div className="mt-4 p-6 bg-white border-2 border-orange-200 rounded-lg">
                            <p className="text-sm text-gray-600 mb-6">Rate each asset across the IDEA stages. Rules: Stages cannot be GOOD unless previous stages are GOOD.</p>
                            
                            <div className="space-y-4">
                              {fogAssets.map((asset, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border-2 ${asset.type === 'intangible' ? 'bg-purple-50 border-purple-300' : 'bg-blue-50 border-blue-300'}`}>
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h4 className={`font-bold ${asset.type === 'intangible' ? 'text-purple-900' : 'text-blue-900'}`}>{asset.name}</h4>
                                      <p className="text-xs text-gray-700 mt-1">{asset.description}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2 mt-3">
                                    {ideaStages.map((stage, stageIdx) => {
                                      const stageStatus = getFogStageStatus(asset.name, stage);
                                      return (
                                        <div key={stageIdx} className="bg-white p-2 rounded border text-center">
                                          <div className="text-xs font-bold text-gray-700 mb-1">{stage}</div>
                                          <div 
                                            className="flex justify-center"
                                            onClick={() => cycleFogStageStatus(asset.name, stage)}
                                          >
                                            {getStatusIcon(stageStatus, editMode)}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-300 rounded-lg p-5 mt-6">
                              <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                                <h4 className="text-lg font-bold text-gray-900">The IDEA Method</h4>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">Follow this process to avoid the banana effect</p>
                              <div className="flex items-center justify-center gap-2 text-green-700">
                                <span className="font-semibold text-sm">IDEA</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="font-semibold text-sm">DESIGN</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="font-semibold text-sm">EDUCATE</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="font-semibold text-sm">ACTION</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {layer.hasKP && (
                      <div className="mb-6">
                        <div 
                          className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-5 cursor-pointer"
                          onClick={() => setExpandedKP(!expandedKP)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Zap className="w-6 h-6 text-green-600" />
                              <h3 className="text-xl font-bold text-gray-900">Key Practice vs Key Action</h3>
                            </div>
                            {expandedKP ? <ChevronDown className="w-6 h-6 text-green-600" /> : <ChevronRight className="w-6 h-6 text-green-600" />}
                          </div>
                        </div>

                        {expandedKP && (
                          <div className="mt-4 p-6 bg-white border-2 border-green-200 rounded-lg">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                                <h4 className="text-lg font-bold text-green-900 mb-3">✅ Key Practice</h4>
                                <p className="text-sm text-gray-700 mb-3">Weekly repeatable act for improvement</p>
                                <div className="mt-4 p-3 bg-white rounded border">
                                  <p className="text-sm italic">"I will have 1x coaching conversation with a team member each week"</p>
                                </div>
                              </div>

                              <div className="bg-teal-50 p-5 rounded-lg border-l-4 border-teal-500">
                                <h4 className="text-lg font-bold text-teal-900 mb-3">✅ Key Action</h4>
                                <p className="text-sm text-gray-700 mb-3">One-time deadline-driven task</p>
                                <div className="mt-4 p-3 bg-white rounded border">
                                  <p className="text-sm italic">"Submit manuscript by July 31"</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <p className="text-sm font-medium text-blue-900">{layer.action}</p>
                      <p className="text-xs text-blue-700 mt-2">OnMission Component: <span className="font-bold">{layer.onMissionComponent}</span></p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeView === 'logic' && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">OnMission Score & Active Intel Decision Logic</h2>
            <p className="text-gray-600 mb-8">
              The OnMission Score is an aggregate weekly measure of where the entire company is at. 
              Use this score to determine organizational focus and AI support level for the week.
            </p>

            <div className="space-y-6 mb-8">
              {decisionLogic.map((logic, idx) => (
                <div key={idx} className="border-l-4 border-gray-300 pl-6 py-4">
                  <div className="flex items-start gap-4">
                    <span className={`text-2xl font-bold ${logic.color} whitespace-nowrap`}>{logic.range}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-2" />
                    <span className="text-base text-gray-900">{logic.focus}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Timing & Frequency Rules</h3>
              <div className="space-y-2">
                {timingRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Core Principle</h3>
              <p className="text-gray-700 mb-2">
                Keep people focused on what matters, clear and confident with action that needs to happen, and ensure results are measured weekly.
              </p>
              <p className="text-gray-700 italic">
                Accountability is huge, but it is more than that. It is about helping people realize how important they each are to the unfolding of their future and the organization. Together, we can get further and achieve more meaningful results.
              </p>
            </div>
          </div>
        )}

        {activeView === 'ai' && (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">AI Insights Framework</h2>
              <p className="text-gray-600 mb-6">Different insights for different roles: Strategic thinking for executives, practical support for frontline workers.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setAiView('executive')}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 ${aiView === 'executive' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Executive Insights</span>
                </button>
                <button 
                  onClick={() => setAiView('frontline')}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 ${aiView === 'frontline' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Frontline Insights</span>
                </button>
              </div>
            </div>

            {aiView === 'executive' && (
              <div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">Executive & Team Insights</h3>
                  <p className="text-sm text-gray-700">Strategic intelligence for C-suite decision-making. Each category triggers different types of executive thinking: Strategic vs Tactical, Proactive vs Reactive, Internal vs External focus, Short-term vs Long-term, Risk vs Opportunity.</p>
                </div>

                <div className="space-y-4">
                  {executiveInsights.map((insight, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-5">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{insight.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">{insight.title}</h4>
                          <p className="text-sm font-medium text-purple-700 mb-2">{insight.subtitle}</p>
                          <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                          <p className="text-sm text-blue-800 italic">"{insight.question}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiView === 'frontline' && (
              <div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-bold text-teal-900 mb-2">Frontline Worker Insights</h3>
                  <p className="text-sm text-gray-700">Practical support for specialists, coordinators, practitioners, and team leads. Focused on "How do I succeed TODAY?" rather than strategic resource allocation.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {frontlineInsights.map((insight, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-xs text-gray-700">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-5">
                  <h4 className="font-bold text-gray-900 mb-2">The Key Difference</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Executive Insights:</span> "What strategic decisions should I make?"</p>
                    <p><span className="font-semibold">Frontline Insights:</span> "How do I succeed in my role and feel good about my work?"</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionDeck;