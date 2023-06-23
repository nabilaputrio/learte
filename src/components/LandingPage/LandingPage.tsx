import { memo } from "react";
import type { FC } from "react";

import resets from "../_resets.module.css";
import { Button_variantFilledRadiusSmSi } from "./Button_variantFilledRadiusSmSi/Button_variantFilledRadiusSmSi";
import { Button_variantOutlineRadiusSmS } from "./Button_variantOutlineRadiusSmS/Button_variantOutlineRadiusSmS";
import { Button_variantSubtleRadiusMdSi } from "./Button_variantSubtleRadiusMdSi/Button_variantSubtleRadiusMdSi";
import { Group151Icon } from "./Group151Icon";
import { IllustrationLayingIcon } from "./IllustrationLayingIcon";
import { IllustrationLovingIcon } from "./IllustrationLovingIcon";
import { IllustrationMeditatingIcon } from "./IllustrationMeditatingIcon";
import { IllustrationMessyIcon } from "./IllustrationMessyIcon";
import { IllustrationPlantIcon } from "./IllustrationPlantIcon";
import { IllustrationReadingSideIcon } from "./IllustrationReadingSideIcon";
import { IllustrationSprintingIcon } from "./IllustrationSprintingIcon";
import { IllustrationUnboxingIcon } from "./IllustrationUnboxingIcon";
import { IllustratorFeatureIcon } from "./IllustratorFeatureIcon";
import classes from "./LandingPage.module.css";

interface Props {
  className?: string;
}
/* @figmaId 101:8702 */
export const LandingPage: FC<Props> = memo(function LandingPage(props = {}) {
  return (
    <div className={`${resets.zalsResets} ${classes.root}`}>
      <div className={classes.body}>
        <div className={classes.hero}>
          <div className={classes.container1}>
            <div className={classes.group1}>
              <div className={classes.group11}>
                <div className={classes.kotak}></div>
                <div className={classes.lime}></div>
              </div>
              <div className={classes.forest}></div>
            </div>
            <div className={classes.smileman}></div>
            <div className={classes.group2}>
              <div className={classes.group21}>
                <div className={classes.group211}>
                  <div className={classes.bobhome}></div>
                  <div className={classes.beardman}></div>
                </div>
                <div className={classes.plate}></div>
              </div>
              <div className={classes.bowl}></div>
            </div>
          </div>
          <div className={classes.container2}>
            <div className={classes.title}>
              <p className={classes.labelWrapper}>
                <span className={classes.label}>
                  Selling Digital Assets Made
                </span>
                <span className={classes.label2}> </span>
                <span className={classes.label3}>Easy</span>
              </p>
            </div>
            <div className={classes.isi}>
              Together, anyone can earn their first money online. Just start
              with what you know, see what sticks, and get paid. It’s that easy.
              Right?
            </div>
            <button className={classes.buttonFilledXSXLFalseTrueFalse}>
              <div className={classes.strtselling}>Start Selling</div>
            </button>
          </div>
        </div>
        <div className={classes.howTo}>
          <div className={classes.container3}>
            <div className={classes.title2}>
              <p className={classes.labelWrapper2}>
                <span className={classes.label4}>Start with </span>
                <span className={classes.label5}>easy</span>
              </p>
            </div>
            <div className={classes.isi2}>
              The easiest to sell someting is start it. Let’s see how it works.
            </div>
          </div>
          <div className={classes.container4}>
            <div className={classes.group3}>
              <div className={classes.illustrationUnboxing}>
                <IllustrationUnboxingIcon className={classes.icon} />
              </div>
              <div className={classes.group31}>
                <div className={classes.subtitle}>Search product you like</div>
                <div className={classes.isine}>
                  Discover product what you selling and make feel happy for a
                  product you selling
                </div>
              </div>
            </div>
            <div className={classes.group4}>
              <div className={classes.illustrationLaying}>
                <IllustrationLayingIcon className={classes.icon2} />
              </div>
              <div className={classes.group41}>
                <div className={classes.subtitle2}>
                  Prepare information product
                </div>
                <div className={classes.isine2}>
                  Give information and context what you selling. We can help you
                  about that.
                </div>
              </div>
            </div>
            <div className={classes.group5}>
              <div className={classes.illustrationMeditating}>
                <IllustrationMeditatingIcon className={classes.icon3} />
              </div>
              <div className={classes.group51}>
                <div className={classes.subtitle3}>Start Selling</div>
                <div className={classes.isine3}>
                  After all, you can sell your product with easly. instead you
                  selling on offline
                </div>
              </div>
            </div>
            <div className={classes.group6}>
              <div className={classes.illustrationLoving}>
                <IllustrationLovingIcon className={classes.icon4} />
              </div>
              <div className={classes.group61}>
                <div className={classes.subtitle4}>Enjoy it</div>
                <div className={classes.isine4}>
                  Done all you work, you just need relax and get money from
                  prodcut you sell.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.advantage}>
          <div className={classes.container5}>
            <div className={classes.group8}>
              <div className={classes.group81}>
                <div className={classes.group811}>
                  <div className={classes.illustrationReadingSide}>
                    <IllustrationReadingSideIcon className={classes.icon5} />
                  </div>
                  <div className={classes.group8111}>
                    <div className={classes.subtitle5}>
                      Easy to sell anything
                    </div>
                    <div className={classes.isine5}>
                      Easy flow to sell rpoduct. You can anything to make easy.
                    </div>
                  </div>
                </div>
                <div className={classes.group812}>
                  <div className={classes.illustrationPlant}>
                    <IllustrationPlantIcon className={classes.icon6} />
                  </div>
                  <div className={classes.group8121}>
                    <div className={classes.subtitle6}>Protective prodict</div>
                    <div className={classes.isine6}>
                      Your product will be safae with us by ultra-wall
                      protection.
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.group82}>
                <div className={classes.group821}>
                  <div className={classes.illustrationSprinting}>
                    <IllustrationSprintingIcon className={classes.icon7} />
                  </div>
                  <div className={classes.group8211}>
                    <div className={classes.subtitle7}>
                      Varies Payment Method{" "}
                    </div>
                    <div className={classes.isine7}>
                      Don’t worry about user to buy your product. Juasdig will
                      make sure all payment available
                    </div>
                  </div>
                </div>
                <div className={classes.group822}>
                  <div className={classes.illustrationMessy}>
                    <IllustrationMessyIcon className={classes.icon8} />
                  </div>
                  <div className={classes.group8221}>
                    <div className={classes.subtitle8}>Not Taxed</div>
                    <div className={classes.isine8}>
                      Are you worry about taxe? Juasdig didn’t take money from
                      you. Relax.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.illustratorFeature}>
              <IllustratorFeatureIcon className={classes.icon9} />
            </div>
            <div className={classes.group7}>
              <div className={classes.title3}>
                <p className={classes.labelWrapper3}>
                  <span className={classes.label6}>Our </span>
                  <span className={classes.label7}>advantage</span>
                  <span className={classes.label8}> compared to others</span>
                </p>
              </div>
              <div className={classes.isi3}>
                Discover Why We Stand Out: Our Unmatched Advantages Over
                Competitors.&quot;
              </div>
            </div>
          </div>
        </div>
        <div className={classes.feature2}>
          <div className={classes.group9}>
            <div className={classes.title4}>
              <p className={classes.labelWrapper4}>
                <span className={classes.label9}>Our </span>
                <span className={classes.label10}>advantage</span>
                <span className={classes.label11}> compared to others</span>
              </p>
            </div>
            <div className={classes.isi4}>
              Regardless of your goals - seeking balance, flexibility, or a
              career change - we simplify the process of forging a new path. No
              technical expertise or business acumen necessary, all you need is
              to leverage your knowledge and start selling
            </div>
          </div>
          <button className={classes.buttonFilledXSXLFalseTrueFalse2}>
            <div className={classes.checkFeature}>Check Feature</div>
          </button>
        </div>
        <div className={classes.categoryProduct}>
          <div className={classes.group10}>
            <div className={classes.title5}>
              <p className={classes.labelWrapper5}>
                <span className={classes.label12}>Searching for </span>
                <span className={classes.label13}>ideas</span>
                <span className={classes.label14}>
                  {" "}
                  on what products or services you can sell?
                </span>
              </p>
            </div>
          </div>
          <div className={classes.container7}>
            <div className={classes.group112}>
              <div className={classes.group111}>
                <div className={classes.subtitle9}>3D</div>
                <div className={classes.isine9}>
                  Perfect your craft with the same tools used at Dreamworks and
                  Pixar.
                </div>
              </div>
              <div className={classes.group1122}>
                <div className={classes.subtitle10}>Audio</div>
                <div className={classes.isine10}>
                  Open your ears and mind to interviews, meditations, and true
                  crime thrillers.
                </div>
              </div>
              <div className={classes.group113}>
                <div className={classes.subtitle11}>Business &amp; Money</div>
                <div className={classes.isine11}>
                  Learn to earn in an increasingly unpredictable world.
                </div>
              </div>
              <div className={classes.group114}>
                <div className={classes.subtitle12}>Drawing &amp; Painting</div>
                <div className={classes.isine12}>
                  Tutorials, plugins, and brushes from pro concept artists and
                  illustrators.
                </div>
              </div>
            </div>
            <div className={classes.group12}>
              <div className={classes.group121}>
                <div className={classes.subtitle13}>
                  Comics &amp; Graphic Novels
                </div>
                <div className={classes.isine13}>
                  Sequential art with loads of heart. Welcome to a paradise of
                  panels.
                </div>
              </div>
              <div className={classes.group122}>
                <div className={classes.subtitle14}>Design</div>
                <div className={classes.isine14}>
                  Code, design, and ship your dream product with these technical
                  resources.
                </div>
              </div>
              <div className={classes.group123}>
                <div className={classes.subtitle15}>Education</div>
                <div className={classes.isine15}>
                  Pick up a new skill with courses and guides from world-class
                  pros.
                </div>
              </div>
              <div className={classes.group124}>
                <div className={classes.subtitle16}>Other</div>
                <div className={classes.isine16}>
                  You can click this card for check other category
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.testimoni}>
          <div className={classes.rompan}></div>
          <div className={classes.group13}>
            <div className={classes.group131}>
              <div className={classes.title6}>
                <p className={classes.labelWrapper6}>
                  <span className={classes.label15}>What They </span>
                  <span className={classes.label16}>Say</span>
                  <span className={classes.label17}>?</span>
                </p>
              </div>
              <div className={classes.isi5}>
                “I launched Book as an experimental side, but within 2 years
                those book were earning more than my 6-figure salary in my work.
                Leaving in favor of JUASDIG enabled me to explore other aspects
                of my art, develop new hobbies, and finally prioritize my
                personal life”
              </div>
            </div>
            <div className={classes.rompan19YearsOld}>
              Rompan (19 Years Old)
            </div>
          </div>
        </div>
        <div className={classes.cTA}>
          <div className={classes.group20}>
            <button className={classes.buttonFilledXSXLFalseTrueFalse3}>
              <div className={classes.startSelling}>Start Selling</div>
            </button>
            <div className={classes.group14}>
              <div className={classes.title7}>vv</div>
              <div className={classes.isi6}>
                Ready to start selling your digital asset and earn money? Sign
                up now and join our community of successful sellers!
              </div>
            </div>
          </div>
          <div className={classes.skeletonsoldier}></div>
        </div>
      </div>
      <div className={classes.footers}>
        <div className={classes.group15}>
          <div className={classes.group151}>
            <Group151Icon className={classes.icon10} />
          </div>
          <div className={classes.copyrightJuasdigAllRightsReser}>
            Copyright ©Juasdig All rights reserved
          </div>
        </div>
        <div className={classes.group16}>
          <div className={classes.works}>Works</div>
          <div className={classes.links}>
            <div className={classes.feature3}>Feature</div>
            <div className={classes.pricing2}>Pricing</div>
            <div className={classes.webApplications}>Web Applications</div>
          </div>
        </div>
        <div className={classes.group17}>
          <div className={classes.visitUs}>Visit Us</div>
          <div className={classes.links2}>
            <div className={classes.aboutUs}>About Us</div>
            <div className={classes.ourTeam}>Our Team</div>
            <div className={classes.contactInformation}>
              Contact Information
            </div>
            <div className={classes.ourVision}>Our Vision</div>
          </div>
        </div>
        <div className={classes.group18}>
          <div className={classes.legal}>Legal</div>
          <div className={classes.links3}>
            <div className={classes.termsConditions}>
              Terms &amp; Conditions
            </div>
            <div className={classes.press}>Press</div>
            <div className={classes.privacyPolicy}>Privacy Policy</div>
            <div className={classes.disclaimer}>Disclaimer</div>
          </div>
        </div>
        <div className={classes.group19}>
          <div className={classes.group191}>
            <div className={classes.group212}>
              <div className={classes._20605061}></div>
              <div className={classes._20605062}></div>
              <div className={classes._20605063}></div>
            </div>
          </div>
          <button className={classes.buttonFilledXSLFalseTrueFalseD}>
            <div className={classes.getInTouch}>Get in touch</div>
          </button>
        </div>
      </div>
    </div>
  );
});
