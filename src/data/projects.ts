export type Status = 'active' | 'beta' | 'in-progress' | 'archived';

export interface Project {
	id: string;
	title: string;
	description: string;
	techStack: string[];
	status: Status;
	href: string;
	gradient: string;
	articleHref?: string;
}

export const projects: Project[] = [
	{
		id: 'rtfp',
		title: 'Real-time Financial Platform',
		description:
			'High-throughput order matching engine handling 1M+ events/sec with sub-millisecond latency guarantees and full audit trail.',
		techStack: ['Go', 'Kafka', 'Redis', 'PostgreSQL', 'gRPC'],
		status: 'active',
		href: '/projects#rtfp',
		gradient: 'ec-gradient-backend',
		articleHref: '/backend',
	},
	{
		id: 'aaa',
		title: 'AI Architecture Advisor',
		description:
			'LLM-powered tool that analyzes system requirements and recommends architecture patterns with cost/latency tradeoff analysis.',
		techStack: ['Python', 'FastAPI', 'Claude API', 'Pinecone', 'React'],
		status: 'beta',
		href: '/projects#aaa',
		gradient: 'ec-gradient-ai-infra',
		articleHref: '/ai-infra',
	},
	{
		id: 'afd',
		title: 'AsyncFlow Debugger',
		description:
			'Distributed tracing and observability tooling for async message-passing systems — visualize event causality across services.',
		techStack: ['Rust', 'OpenTelemetry', 'ClickHouse', 'React', 'D3'],
		status: 'in-progress',
		href: '/projects#afd',
		gradient: 'ec-gradient-async',
		articleHref: '/async-systems',
	},
	{
		id: 'incident-replay',
		title: 'Incident Replay Engine',
		description:
			'Record and deterministically replay production incidents in a sandboxed environment for post-mortem analysis.',
		techStack: ['Go', 'Postgres', 'Docker', 'TimescaleDB'],
		status: 'in-progress',
		href: '/projects#incident-replay',
		gradient: 'ec-gradient-production',
		articleHref: '/production',
	},
	{
		id: 'consensus-sim',
		title: 'Consensus Algorithm Simulator',
		description:
			'Interactive visualization of Raft and Paxos protocols under network partition and node failure scenarios.',
		techStack: ['TypeScript', 'React', 'D3', 'WebSockets'],
		status: 'archived',
		href: '/projects#consensus-sim',
		gradient: 'ec-gradient-distributed',
		articleHref: '/distributed',
	},
];
