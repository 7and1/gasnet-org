import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './community.module.css';

const supportChannels = [
  {
    title: 'GitHub Discussions',
    description: 'Ask questions and share tuning notes with the GASNet community.',
    link: 'https://github.com/gasnet',
  },
  {
    title: 'Issue Tracker',
    description: 'Report bugs or request documentation updates.',
    link: 'https://github.com/gasnet',
  },
  {
    title: 'Research Mailing List',
    description: 'Coordinate benchmarks, papers, and collaboration updates.',
    link: 'mailto:community@gasnet.org',
  },
];

const contributionTracks = [
  {
    title: 'Benchmark Contributions',
    description: 'Submit new datasets using the JSON template and schema checks.',
    link: '/docs/benchmarks/microbenchmarks',
  },
  {
    title: 'Documentation Improvements',
    description: 'Expand architecture notes, add topology diagrams, and validate links.',
    link: '/docs/getting-started/intro',
  },
  {
    title: 'Deployment Playbook',
    description: 'Review the production checklist and keep operations docs current.',
    link: '/docs/operations/deployment',
  },
];

const events = [
  'SC Conference BoF: GASNet updates and runtime tuning',
  'ISC Workshop: PGAS programming models',
  'DOE Exascale meetings and vendor roadmaps',
];

export default function Community() {
  return (
    <Layout
      title="Community"
      description="Community resources, contribution paths, and events for Gasnet.org."
    >
      <header className={clsx('hero', styles.hero)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Community
          </Heading>
          <p className={clsx('hero__subtitle', styles.subtitle)}>
            Connect with researchers, share benchmark data, and help evolve the GASNet knowledge
            base.
          </p>
        </div>
      </header>

      <main className="container margin-vert--xl">
        <section className="margin-bottom--xl">
          <Heading as="h2" className={styles.sectionTitle}>
            Get support
          </Heading>
          <div className={styles.grid}>
            {supportChannels.map(channel => (
              <div key={channel.title} className={clsx('card', styles.card)}>
                <div className="card__body">
                  <Heading as="h3">{channel.title}</Heading>
                  <p>{channel.description}</p>
                </div>
                <div className="card__footer">
                  <Link className="button button--secondary" to={channel.link}>
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="margin-bottom--xl">
          <Heading as="h2" className={styles.sectionTitle}>
            Contribute
          </Heading>
          <div className={styles.grid}>
            {contributionTracks.map(track => (
              <div key={track.title} className={clsx('card', styles.card)}>
                <div className="card__body">
                  <Heading as="h3">{track.title}</Heading>
                  <p>{track.description}</p>
                </div>
                <div className="card__footer">
                  <Link className="button button--primary" to={track.link}>
                    Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Heading as="h2" className={styles.sectionTitle}>
            Events & meetups
          </Heading>
          <ul className={styles.eventList}>
            {events.map(event => (
              <li key={event}>{event}</li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
