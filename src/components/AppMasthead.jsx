import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  MenuToggle,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  FormGroup,
  TextArea,
  PageToggleButton,
  Tooltip,
} from '@patternfly/react-core';
import {
  SearchIcon,
  QuestionCircleIcon,
  MoonIcon,
  SunIcon,
  DownloadIcon,
  CheckCircleIcon,
  ChartLineIcon,
  CaretDownIcon,
  BarsIcon,
} from '@patternfly/react-icons';
import BrandLogo from './BrandLogo';
import './Header.css';

const DARK_MODE_KEY = 'isDarkMode';

const CLI_DOWNLOAD_OPTIONS = [
  { os: 'darwin-amd64', display: 'Mac x86_64' },
  { os: 'darwin-arm64', display: 'Mac arm_64' },
  { os: 'linux-amd64', display: 'Linux x86_64' },
  { os: 'linux-arm64', display: 'Linux arm_64' },
  { os: 'linux-ppc64le', display: 'Linux ppc64le' },
  { os: 'linux-s390x', display: 'Linux s390x' },
  { os: 'windows-amd64', display: 'Windows x86_64' },
];

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored !== null) return stored === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('pf-v6-theme-dark');
    } else {
      html.classList.remove('pf-v6-theme-dark');
    }
    localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
  }, [isDarkMode]);

  const toggle = useCallback(() => setIsDarkMode((prev) => !prev), []);
  return { isDarkMode, toggle };
}

export default function AppMasthead({ dashboardPath, routePrefix }) {
  const navigate = useNavigate();
  const { isDarkMode, toggle: toggleTheme } = useDarkMode();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCLIMenuOpen, setIsCLIMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [toasts, setToasts] = useState([]);

  const prefix = routePrefix || '/v1';

  const addToast = useCallback((title, variant = 'info') => {
    const key = Date.now();
    setToasts((prev) => [...prev, { key, title, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.key !== key)), 4000);
  }, []);

  const removeToast = useCallback((key) => {
    setToasts((prev) => prev.filter((t) => t.key !== key));
  }, []);

  const handleDownloadCLI = (os, display) => {
    setIsCLIMenuOpen(false);
    addToast(`Downloading roxctl for ${display}`, 'info');
    setTimeout(() => addToast(`roxctl for ${display} downloaded successfully`, 'success'), 2000);
  };

  return (
    <>
      <Masthead
        className="ignore-react-onclickoutside theme-dark"
        display={{ default: 'inline' }}
        inset={{ default: 'insetNone' }}
      >
        <MastheadMain>
          <MastheadToggle className="pf-v6-u-pl-lg">
            <PageToggleButton variant="plain">
              <BarsIcon />
            </PageToggleButton>
          </MastheadToggle>
          <MastheadBrand data-codemods>
            <MastheadLogo component="a" href={dashboardPath || '/'}>
              <BrandLogo />
            </MastheadLogo>
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent
          className="pf-v6-u-flex-grow-1 pf-v6-u-pr-lg"
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexWrap: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }} flexWrap={{ default: 'nowrap' }}>
            <FlexItem>
              <Button
                variant="plain"
                aria-label="Search"
                icon={<SearchIcon />}
                onClick={() => navigate(`${prefix}/main/search`)}
              >
                Search
              </Button>
            </FlexItem>

            <FlexItem>
              <Dropdown
                isOpen={isCLIMenuOpen}
                onOpenChange={setIsCLIMenuOpen}
                onSelect={() => setIsCLIMenuOpen(false)}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setIsCLIMenuOpen(!isCLIMenuOpen)}
                    isExpanded={isCLIMenuOpen}
                    aria-label="CLI Download Menu"
                  >
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} flexWrap={{ default: 'nowrap' }}>
                      <FlexItem><DownloadIcon /></FlexItem>
                      <FlexItem>CLI</FlexItem>
                    </Flex>
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {CLI_DOWNLOAD_OPTIONS.map(({ os, display }) => (
                    <DropdownItem key={os} onClick={() => handleDownloadCLI(os, display)}>
                      {display}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
            </FlexItem>

            <FlexItem>
              <Tooltip content={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} position="bottom">
                <Button aria-label="Toggle theme" onClick={toggleTheme} variant="plain">
                  {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </Button>
              </Tooltip>
            </FlexItem>

            <FlexItem>
              <Tooltip content="Cluster activity" position="bottom">
                <Button variant="plain" aria-label="Cluster activity" onClick={() => navigate(`${prefix}/main/clusters`)}>
                  <ChartLineIcon />
                </Button>
              </Tooltip>
            </FlexItem>
            <FlexItem>
              <Tooltip
                content={
                  <div>
                    <div>Cluster status problems</div>
                    <table>
                      <tbody>
                        <tr>
                          <th style={{ fontWeight: 400, paddingRight: 12, textAlign: 'left' }}>Unhealthy</th>
                          <td style={{ textAlign: 'right' }}>0</td>
                        </tr>
                        <tr>
                          <th style={{ fontWeight: 400, paddingRight: 12, textAlign: 'left' }}>Degraded</th>
                          <td style={{ textAlign: 'right' }}>0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                }
                isContentLeftAligned
                position="bottom"
              >
                <Button
                  variant="plain"
                  aria-label="Cluster status — all healthy"
                  onClick={() =>
                    navigate(
                      `${prefix}/main/clusters?s[Cluster status][0]=UNHEALTHY&s[Cluster status][1]=DEGRADED`
                    )
                  }
                >
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--default)" />
                </Button>
              </Tooltip>
            </FlexItem>

            <FlexItem>
              <Dropdown
                isOpen={isHelpMenuOpen}
                onOpenChange={setIsHelpMenuOpen}
                onSelect={() => setIsHelpMenuOpen(false)}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                    isExpanded={isHelpMenuOpen}
                    aria-label="Help menu"
                  >
                    <QuestionCircleIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem
                    key="api-v1"
                    onClick={() => navigate(`${prefix}/main/apidocs`)}
                  >
                    API Reference (v1)
                  </DropdownItem>
                  <DropdownItem
                    key="api-v2"
                    onClick={() => navigate(`${prefix}/main/apidocs-v2`)}
                  >
                    API Reference (v2)
                  </DropdownItem>
                  <DropdownItem
                    key="feedback"
                    component="button"
                    onClick={() => {
                      setIsHelpMenuOpen(false);
                      setIsFeedbackModalOpen(true);
                    }}
                  >
                    Share feedback
                  </DropdownItem>
                  <DropdownItem
                    key="help"
                    to="https://docs.redhat.com/en/documentation/red_hat_advanced_cluster_security_for_kubernetes"
                    isExternalLink
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Help Center
                  </DropdownItem>
                  <Divider component="li" key="sep" />
                  <DropdownItem key="version" isDisabled isAriaDisabled>
                    v4.7.0
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>

            <FlexItem>
              <Dropdown
                isOpen={isUserDropdownOpen}
                onOpenChange={setIsUserDropdownOpen}
                onSelect={() => setIsUserDropdownOpen(false)}
                popperProps={{ position: 'right' }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    isExpanded={isUserDropdownOpen}
                    variant="plainText"
                    aria-label="User menu"
                    icon={<CaretDownIcon />}
                    iconPosition="end"
                  >
                    AR
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem
                    key="user-info"
                    isDisabled
                    description="Admin"
                    className="pf-v6-u-min-width"
                    style={{ '--pf-v6-u-min-width--MinWidth': '20ch', pointerEvents: 'none' }}
                  >
                    admin@example.com
                  </DropdownItem>
                  <Divider component="li" key="sep" />
                  <DropdownItem
                    key="profile"
                    onClick={() => navigate(`${prefix}/main/user`)}
                  >
                    My profile
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    component="button"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      navigate('/');
                    }}
                  >
                    Log out
                  </DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
          </Flex>
        </MastheadContent>
      </Masthead>

      <AlertGroup isToast isLiveRegion>
        {toasts.map((t) => (
          <Alert
            key={t.key}
            variant={t.variant}
            title={t.title}
            actionClose={<AlertActionCloseButton onClose={() => removeToast(t.key)} />}
            timeout={4000}
            onTimeout={() => removeToast(t.key)}
          />
        ))}
      </AlertGroup>

      <Modal
        variant="medium"
        isOpen={isFeedbackModalOpen}
        onClose={() => { setIsFeedbackModalOpen(false); setFeedbackText(''); }}
      >
        <ModalHeader title="Share feedback" />
        <ModalBody>
          <Form>
            <FormGroup label="How can we improve Red Hat Advanced Cluster Security?" fieldId="feedback-text">
              <TextArea
                id="feedback-text"
                value={feedbackText}
                onChange={(_e, val) => setFeedbackText(val)}
                placeholder="Tell us what you think..."
                rows={6}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              setIsFeedbackModalOpen(false);
              addToast('Thank you for your feedback!', 'success');
              setFeedbackText('');
            }}
            isDisabled={!feedbackText.trim()}
          >
            Submit
          </Button>
          <Button variant="link" onClick={() => { setIsFeedbackModalOpen(false); setFeedbackText(''); }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
