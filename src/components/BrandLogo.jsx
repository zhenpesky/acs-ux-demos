import { Brand } from '@patternfly/react-core';

import rhacsLogoSvg from '../assets/RHACS-Logo.svg';

export default function BrandLogo(props) {
  return (
    <Brand
      {...props}
      src={rhacsLogoSvg}
      alt="Red Hat Advanced Cluster Security Logo"
      style={{ display: 'block', height: '34px', width: 'auto', ...(props?.style || {}) }}
    />
  );
}
