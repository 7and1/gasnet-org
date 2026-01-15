import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './notFound.module.css';

export default function NotFound() {
  return (
    <Layout title="Page Not Found" description="The page you are looking for does not exist.">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <Heading as="h1" className={styles.title}>
            Signal Lost
          </Heading>
          <p className={styles.message}>
            The requested endpoint does not exist in this network segment. The resource may have
            been moved, deleted, or the coordinates may be incorrect.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary" to="/">
              Return to Home
            </Link>
            <Link className="button button--secondary" to="/docs/getting-started/intro">
              Documentation
            </Link>
            <Link className="button button--secondary" to="/labs">
              Research Labs
            </Link>
          </div>
          <div className={styles.helpSection}>
            <p className={styles.helpText}>
              If you believe this is an error, please report the issue via{' '}
              <a href="https://github.com/gasnet/gasnet.org/issues" className={styles.externalLink}>
                GitHub Issues
              </a>
              .
            </p>
          </div>
        </div>
        <div className={styles.decorative}>
          <div className={styles.gridLines}></div>
          <div className={styles.signalDot}></div>
        </div>
      </div>
    </Layout>
  );
}
