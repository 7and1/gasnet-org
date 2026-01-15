import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './labs.module.css';

const researchAreas = [
  {
    name: 'PGAS Runtimes',
    description: 'Partitioned Global Address Space implementations and language extensions.',
    icon: 'memory',
  },
  {
    name: 'Interconnect Design',
    description: 'Network topology, routing, and hardware acceleration for HPC fabrics.',
    icon: 'network',
  },
  {
    name: 'Collective Operations',
    description: 'Scalable algorithms for broadcast, reduce, and all-to-all patterns.',
    icon: 'sync',
  },
  {
    name: 'RDMA Systems',
    description: 'Remote Direct Memory Access programming and zero-copy optimizations.',
    icon: 'transfer',
  },
];

const featuredLabs = [
  {
    name: 'Parallel Runtime Lab',
    institution: 'UC Berkeley',
    focus: 'PGAS runtimes, active message systems',
    region: 'North America',
    url: 'https://gasnet.cs.berkeley.edu',
    publications: ['GASNet-EX', 'UPC++'],
  },
  {
    name: 'Fabric Systems Group',
    institution: 'ETH Zurich',
    focus: 'Interconnect design, topology analytics',
    region: 'Europe',
    url: '#',
    publications: ['Dragonfly Topology', 'Adaptive Routing'],
  },
  {
    name: 'Accelerator Systems Lab',
    institution: 'University of Tokyo',
    focus: 'GPU-aware networking, RDMA for accelerators',
    region: 'Asia',
    url: '#',
    publications: ['GPU Direct', 'NVLink Analytics'],
  },
  {
    name: 'Scalable Algorithms Lab',
    institution: 'Global Collaboration',
    focus: 'Collective optimization at scale',
    region: 'Global',
    url: '#',
    publications: ['MPI Collective Tuning', 'Hierarchical Algorithms'],
  },
];

function AreaCard({ name, description, icon }) {
  const iconSymbols = {
    memory: 'M',
    network: 'N',
    sync: 'S',
    transfer: 'T',
  };

  return (
    <div className={clsx('card', styles.areaCard)}>
      <div className={styles.areaIcon}>{iconSymbols[icon] || icon}</div>
      <Heading as="h3" className={styles.areaName}>
        {name}
      </Heading>
      <p className={styles.areaDescription}>{description}</p>
    </div>
  );
}

function LabCard({ lab }) {
  return (
    <div className={clsx('card', styles.labCard)}>
      <div className={styles.labHeader}>
        <Heading as="h3" className={styles.labName}>
          {lab.name}
        </Heading>
        <span className={styles.labRegion}>{lab.region}</span>
      </div>
      <div className={styles.labInstitution}>{lab.institution}</div>
      <p className={styles.labFocus}>{lab.focus}</p>
      <div className={styles.labPublications}>
        {lab.publications.map(pub => (
          <span key={pub} className={styles.pubTag}>
            {pub}
          </span>
        ))}
      </div>
      <Link to={lab.url} className={clsx('button button--secondary', styles.labLink)}>
        Visit Lab
      </Link>
    </div>
  );
}

export default function LabsPage() {
  return (
    <Layout
      title="Research Labs"
      description="HPC networking labs and academic groups working on GASNet-adjacent systems."
    >
      <header className={clsx('hero', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Research Labs
          </Heading>
          <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
            Academic and research groups advancing HPC networking, PGAS runtimes, and interconnect
            design.
          </p>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Research Focus Areas
            </Heading>
            <p className={styles.sectionLead}>
              The GASNet ecosystem spans multiple research disciplines focused on high-performance
              communication and scalable systems.
            </p>
            <div className={styles.areaGrid}>
              {researchAreas.map(area => (
                <AreaCard key={area.name} {...area} />
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <Heading as="h2" className={styles.sectionTitle}>
              Featured Labs
            </Heading>
            <p className={styles.sectionLead}>
              Curated directory of research groups contributing to the GASNet community and HPC
              networking at large.
            </p>
            <div className={styles.labGrid}>
              {featuredLabs.map((lab, index) => (
                <LabCard key={`${lab.name}-${index}`} lab={lab} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.submitCallout}>
              <div>
                <Heading as="h2" className={styles.sectionTitle}>
                  Submit Your Lab
                </Heading>
                <p className={styles.sectionLead}>
                  Is your lab working on GASNet, PGAS runtimes, or HPC networking? We welcome
                  submissions to this directory.
                </p>
                <ul className={styles.submitList}>
                  <li>Institution and group name</li>
                  <li>Primary research focus area</li>
                  <li>Key publications or artifacts</li>
                  <li>Contact or landing page URL</li>
                </ul>
              </div>
              <Link className="button button--primary" to="https://github.com/gasnet/gasnet.org">
                Submit via GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
