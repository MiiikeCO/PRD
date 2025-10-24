
import React, { useState, useMemo } from 'react';
import { GeneratedContent, Ticket, AIPrompt } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';
import { DocumentIcon } from './icons/DocumentIcon';
import { TicketIcon } from './icons/TicketIcon';
import { CodeIcon } from './icons/CodeIcon';

interface Props {
  content: GeneratedContent;
  onGenerate: () => void;
  onStartOver: () => void;
  isLoading: boolean;
}

type Tab = 'prd' | 'tickets' | 'prompts';

const CopyIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CheckIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;


const Step5_Results: React.FC<Props> = ({ content, onGenerate, onStartOver, isLoading }) => {
  const [activeTab, setActiveTab] = useState<Tab>('prd');

  const hasContent = content.prd && content.tickets && content.prompts;

  if (isLoading) {
    return <LoadingSpinner text="Generating your documents..." />;
  }
  
  if (!hasContent) {
    return (
        <div className="text-center flex flex-col items-center gap-6 py-8">
            <h2 className="text-2xl font-bold text-white">Ready to Generate Your Product Blueprint?</h2>
            <p className="text-gray-400 max-w-md">Click the button below to generate the Product Requirements Document, development tickets, and AI prompts based on your inputs.</p>
            <Button onClick={onGenerate} size="large">
                Generate Documents
            </Button>
        </div>
    )
  }

  const TabButton = ({ tab, label, icon }: { tab: Tab; label: string; icon: React.ReactNode; }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'prd':
        return <PRDDisplay prd={content.prd!} />;
      case 'tickets':
        return <TicketsDisplay tickets={content.tickets!} />;
      case 'prompts':
        return <PromptsDisplay prompts={content.prompts!} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Product Blueprint</h2>
          <p className="text-gray-400 mt-1">Here are the generated assets for your project.</p>
        </div>
        <Button onClick={onGenerate} variant="secondary">Re-generate Documents</Button>
      </div>
      
      <div className="bg-gray-800 p-2 rounded-lg flex space-x-2">
        <TabButton tab="prd" label="PRD" icon={<DocumentIcon />} />
        <TabButton tab="tickets" label="Tickets" icon={<TicketIcon />} />
        <TabButton tab="prompts" label="AI Prompts" icon={<CodeIcon />} />
      </div>

      <div className="mt-4">{renderContent()}</div>

      <div className="flex justify-center mt-6">
        <Button onClick={onStartOver} variant="ghost">Start New Project</Button>
      </div>
    </div>
  );
};

const markdownToHtml = (markdown: string): string => {
  let html = markdown
    // Process list blocks first
    .replace(/(?:^\* .*(?:\n|$))+/gm, (match) => {
      const items = match.trim().split('\n').map(item => `<li>${item.substring(item.indexOf(' ') + 1).trim()}</li>`).join('');
      return `<ul>${items}</ul>`;
    })
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Process paragraphs for remaining text blocks
  html = html.split(/\n\n+/).map(paragraph => {
    if (paragraph.startsWith('<ul') || paragraph.startsWith('<h')) {
      return paragraph;
    }
    return `<p>${paragraph.replace(/\n/g, '<br />')}</p>`;
  }).join('');

  // Process inline elements last
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  return html;
};

const PRDDisplay: React.FC<{ prd: string }> = ({ prd }) => {
  const [view, setView] = useState<'rendered' | 'raw'>('rendered');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedRich, setCopiedRich] = useState(false);
  
  const renderedHtml = useMemo(() => markdownToHtml(prd), [prd]);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(prd);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleCopyRichText = async () => {
    try {
        const htmlBlob = new Blob([renderedHtml], { type: 'text/html' });
        const textBlob = new Blob([prd], { type: 'text/plain' });
        const clipboardItem = new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
        });
        await navigator.clipboard.write([clipboardItem]);
        setCopiedRich(true);
        setTimeout(() => setCopiedRich(false), 2000);
    } catch (err) {
        console.error('Failed to copy rich text:', err);
        // Fallback to plain text copy on error
        handleCopyMarkdown();
    }
  };
  
  return (
    <Card className="bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-1 self-start">
            <button onClick={() => setView('rendered')} className={`px-3 py-1 text-sm font-medium rounded-md transition ${view === 'rendered' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Rendered</button>
            <button onClick={() => setView('raw')} className={`px-3 py-1 text-sm font-medium rounded-md transition ${view === 'raw' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Markdown</button>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
            <Button onClick={handleCopyRichText} variant="secondary">
                {copiedRich ? <CheckIcon /> : <CopyIcon />} Copy for Word
            </Button>
            <Button onClick={handleCopyMarkdown} variant="ghost" className="!p-2" aria-label="Copy Markdown Source">
                {copiedMarkdown ? <CheckIcon /> : <CopyIcon />}
            </Button>
        </div>
      </div>
      {view === 'rendered' ? (
        <div 
          className="prose prose-invert prose-sm sm:prose-base max-w-none max-h-[55vh] overflow-y-auto p-4 bg-gray-950 rounded-md"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      ) : (
        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-950 p-4 rounded-md max-h-[55vh] overflow-y-auto">
            <code>{prd}</code>
        </pre>
      )}
    </Card>
  );
};


const TicketsDisplay: React.FC<{ tickets: Ticket[] }> = ({ tickets }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleCopy = (ticket: Ticket, index: number) => {
    const ticketString = `Title: ${ticket.title}\n\nDescription: ${ticket.description}\n\nAcceptance Criteria:\n${ticket.acceptanceCriteria.map(ac => `- ${ac}`).join('\n')}`;
    navigator.clipboard.writeText(ticketString);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  const handleCopyAll = () => {
    const allTicketsString = tickets.map(ticket => {
      const criteria = ticket.acceptanceCriteria.map(ac => `- ${ac}`).join('\n');
      return `Title: ${ticket.title}\n\nDescription: ${ticket.description}\n\nAcceptance Criteria:\n${criteria}`;
    }).join('\n\n--------------------\n\n');

    navigator.clipboard.writeText(allTicketsString);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div>
        <div className="flex justify-end mb-4">
            <Button onClick={handleCopyAll} variant="secondary">
                {allCopied ? <><CheckIcon /> Copied All</> : 'Copy All Tickets'}
            </Button>
        </div>
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
        {tickets.map((ticket, index) => (
            <Card key={index} className="bg-gray-900/70 relative">
            <h3 className="font-bold text-lg text-blue-400 flex items-center gap-2"><TicketIcon/> {ticket.title}</h3>
            <p className="text-gray-300 mt-2 text-sm">{ticket.description}</p>
            <div className="mt-4">
                <h4 className="font-semibold text-gray-200">Acceptance Criteria:</h4>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-400">
                {ticket.acceptanceCriteria.map((ac, i) => <li key={i}>{ac}</li>)}
                </ul>
            </div>
            <Button 
                onClick={() => handleCopy(ticket, index)}
                variant="ghost"
                className="absolute top-4 right-4 !p-2"
                aria-label="Copy ticket"
            >
                {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
            </Button>
            </Card>
        ))}
        </div>
    </div>
  );
};

const PromptsDisplay: React.FC<{ prompts: AIPrompt[] }> = ({ prompts }) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [allCopied, setAllCopied] = useState(false);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        const allPromptsString = prompts.map(prompt => {
            return `Ticket: ${prompt.ticketTitle}\n\nPrompt:\n${prompt.generationPrompt}`;
        }).join('\n\n====================\n\n');
        navigator.clipboard.writeText(allPromptsString);
        setAllCopied(true);
        setTimeout(() => setAllCopied(false), 2000);
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={handleCopyAll} variant="secondary">
                    {allCopied ? <><CheckIcon /> Copied All</> : 'Copy All Prompts'}
                </Button>
            </div>
            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                {prompts.map((prompt, index) => (
                <Card key={index} className="bg-gray-900/70 relative">
                    <h3 className="font-bold text-lg text-purple-400 flex items-center gap-2"><CodeIcon/>{prompt.ticketTitle}</h3>
                    <pre className="bg-gray-950 rounded-md p-4 mt-2 text-sm text-gray-300 whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                    <code>{prompt.generationPrompt}</code>
                    </pre>
                    <Button 
                        onClick={() => handleCopy(prompt.generationPrompt, index)}
                        variant="ghost"
                        className="absolute top-4 right-4 !p-2"
                        aria-label="Copy prompt"
                    >
                    {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                    </Button>
                </Card>
                ))}
            </div>
        </div>
    );
};


export default Step5_Results;
