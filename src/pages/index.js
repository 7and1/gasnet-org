import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const quickSignals = [
  {
    label: 'Latency Budget',
    value: '1.8 µs',
    detail: 'Small message p50 on tuned RDMA path',
  },
  {
    label: 'Bandwidth Plateau',
    value: '182 GB/s',
    detail: 'Dual-rail saturation on modern fabrics',
  },
  {
    label: 'Scale Target',
    value: '8,192 nodes',
    detail: 'Collective fan-out planning baseline',
  },
];

const focusAreas = [
  {
    title: 'Protocol Intelligence',
    body: 'Map transport capabilities to runtime semantics and avoid hidden latency cliffs.',
  },
  {
    title: 'Benchmark Discipline',
    body: 'Treat measurements as evidence, with clear controls and reproducible baselines.',
  },
  {
    title: 'Systems Integration',
    body: 'Align schedulers, job launchers, and runtime hooks for stable production runs.',
  },
  {
    title: 'Research Signals',
    body: 'Track new interconnects, fabrics, and PGAS runtime directions in one place.',
  },
];

function SignalCard({ label, value, detail }) {
  return (
    <div className={clsx('card', styles.signalCard)}>
      <div className={styles.signalLabel}>{label}</div>
      <div className={styles.signalValue}>{value}</div>
      <div className={styles.signalDetail}>{detail}</div>
    </div>
  );
}

function FocusCard({ title, body }) {
  return (
    <div className={clsx('card', styles.focusCard)}>
      <Heading as="h3" className={styles.focusTitle}>
        {title}
      </Heading>
      <p className={styles.focusBody}>{body}</p>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={clsx('container', styles.heroLayout)}>
        <div className={clsx(styles.heroCopy, 'fade-in-up')}>
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className={clsx('hero__subtitle', styles.heroSubtitle)}>{siteConfig.tagline}</p>
          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="/docs/getting-started/intro">
              Enter the Knowledge Base
            </Link>
            <Link className="button button--secondary button--lg" to="/labs">
              Explore Research Labs
            </Link>
          </div>
        </div>
        <div className={clsx(styles.heroPanel, 'scanline')}>
          <div className={styles.panelTitle}>Signal Console</div>
          <div className={styles.panelSubtitle}>Snapshot of key HPC transport metrics.</div>
          <div className={styles.signalGrid}>
            {quickSignals.map(signal => (
              <SignalCard key={signal.label} {...signal} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="GASNet knowledge base"
      description="Gasnet.org documents high-performance networking patterns, benchmarks, and research signals."
    >
      <HomepageHeader />
      <main>
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              What this site optimizes for
            </Heading>
            <p className={styles.sectionLead}>
              Gasnet.org is built for engineers and researchers who need clear, fast, and verifiable
              knowledge about HPC communication layers.
            </p>
            <div className={clsx('home-grid', styles.focusGrid)}>
              {focusAreas.map(focus => (
                <FocusCard key={focus.title} {...focus} />
              ))}
            </div>
          </div>
        </section>
        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className={styles.callout}>
              <div>
                <Heading as="h2" className={styles.sectionTitle}>
                  Build a repeatable performance narrative
                </Heading>
                <p className={styles.sectionLead}>
                  Document hardware baselines, runtime configuration, and topology decisions in one
                  shared place. Every benchmark should explain the decision it enabled.
                </p>
              </div>
              <Link className="button button--primary" to="/docs/benchmarks/microbenchmarks">
                View Benchmark Guide
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
