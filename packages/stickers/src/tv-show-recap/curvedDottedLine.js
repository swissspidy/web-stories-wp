/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Curved Dotted Line', 'sticker name', 'web-stories');

function CurvedDottedLine({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 43 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.2375 1.03526C42.2255 1.28332 42.2133 1.52441 42.2008 1.75938C42.1901 1.96124 42.345 2.1336 42.5469 2.14434C42.7488 2.15509 42.9211 2.00015 42.9319 1.79828C42.9444 1.56198 42.9567 1.31964 42.9687 1.07045C42.9784 0.868524 42.8226 0.696962 42.6207 0.687246C42.4187 0.67753 42.2472 0.83334 42.2375 1.03526ZM42.4556 3.58841C42.254 3.57301 42.0782 3.72392 42.0628 3.92549C42.0249 4.42106 41.9835 4.89678 41.9374 5.36473C41.9176 5.56591 42.0646 5.74506 42.2658 5.76489C42.4669 5.78471 42.6461 5.63769 42.6659 5.43651C42.7126 4.96288 42.7544 4.48181 42.7927 3.98127C42.8081 3.7797 42.6572 3.60382 42.4556 3.58841ZM42.0979 7.20205C41.8976 7.17517 41.7134 7.31581 41.6865 7.51617C41.6549 7.75158 41.6217 7.98975 41.5867 8.23219C41.5547 8.45403 41.5203 8.68085 41.4834 8.91238C41.4515 9.11201 41.5875 9.29965 41.7871 9.3315C41.9868 9.36335 42.1744 9.22734 42.2063 9.02771C42.2438 8.79261 42.2787 8.5622 42.3113 8.33675C42.3466 8.09204 42.3801 7.85145 42.4121 7.61349C42.4389 7.41314 42.2983 7.22893 42.0979 7.20205ZM41.5456 10.6637C41.3475 10.6237 41.1544 10.7518 41.1143 10.95C41.0255 11.389 40.9286 11.8398 40.8229 12.3008C40.7777 12.4978 40.9008 12.6942 41.0979 12.7394C41.2949 12.7845 41.4913 12.6614 41.5364 12.4644C41.6435 11.9971 41.7418 11.5402 41.8318 11.095C41.8719 10.8969 41.7437 10.7038 41.5456 10.6637ZM40.7704 14.0532C40.5752 14.0007 40.3743 14.1163 40.3218 14.3115C40.2042 14.7481 40.0791 15.1914 39.9461 15.6405C39.8887 15.8343 39.9993 16.0379 40.1931 16.0954C40.3869 16.1528 40.5906 16.0422 40.648 15.8483C40.7828 15.3933 40.9095 14.9442 41.0286 14.5018C41.0812 14.3066 40.9656 14.1058 40.7704 14.0532ZM39.7846 17.3854C39.593 17.3208 39.3853 17.4236 39.3207 17.6152C39.1753 18.046 39.0226 18.4806 38.8624 18.9181C38.7929 19.108 38.8904 19.3182 39.0802 19.3877C39.2701 19.4572 39.4803 19.3597 39.5498 19.1698C39.7122 18.7263 39.8669 18.2859 40.0143 17.8493C40.079 17.6578 39.9761 17.4501 39.7846 17.3854ZM38.5898 20.6506C38.4028 20.5737 38.1889 20.663 38.1121 20.8499C37.9387 21.2716 37.7582 21.6949 37.5702 22.1192C37.4884 22.3041 37.5718 22.5203 37.7567 22.6021C37.9415 22.684 38.1577 22.6005 38.2396 22.4157C38.4302 21.9852 38.6133 21.5559 38.7891 21.1283C38.866 20.9414 38.7768 20.7275 38.5898 20.6506ZM37.1831 23.8285C37.0018 23.739 36.7823 23.8135 36.6929 23.9947C36.4906 24.4045 36.2812 24.8144 36.0644 25.2236C35.9698 25.4023 36.0379 25.6238 36.2165 25.7184C36.3951 25.8131 36.6167 25.745 36.7113 25.5663C36.9314 25.1507 37.1441 24.7347 37.3493 24.3187C37.4388 24.1374 37.3644 23.918 37.1831 23.8285ZM35.5567 26.9002C35.3824 26.7977 35.1581 26.8559 35.0556 27.0301C34.8237 27.4243 34.5845 27.8172 34.3379 28.2082C34.2301 28.3792 34.2813 28.6052 34.4522 28.7131C34.6232 28.8209 34.8493 28.7697 34.9571 28.5987C35.2078 28.2012 35.4509 27.8019 35.6866 27.4013C35.7891 27.2271 35.7309 27.0027 35.5567 26.9002ZM33.7031 29.8405C33.5375 29.7245 33.3093 29.7648 33.1934 29.9304C33.0618 30.1183 32.9284 30.3056 32.7932 30.4921C32.6537 30.6844 32.5143 30.8745 32.3749 31.0625C32.2545 31.2249 32.2886 31.4541 32.451 31.5745C32.6133 31.695 32.8426 31.6609 32.963 31.4985C33.1039 31.3085 33.2449 31.1162 33.3858 30.9218C33.5235 30.732 33.6592 30.5414 33.793 30.3503C33.909 30.1847 33.8687 29.9564 33.7031 29.8405ZM31.6109 32.669C31.4527 32.5432 31.2224 32.5694 31.0966 32.7276C30.8014 33.0986 30.5061 33.4604 30.2108 33.8133C30.0811 33.9684 30.1016 34.1992 30.2566 34.329C30.4117 34.4587 30.6425 34.4382 30.7722 34.2832C31.0715 33.9255 31.3705 33.559 31.6694 33.1834C31.7953 33.0252 31.7691 32.7949 31.6109 32.669ZM29.3477 35.3728C29.198 35.2369 28.9666 35.2482 28.8307 35.3979C28.5126 35.7484 28.1943 36.0891 27.8756 36.4206C27.7355 36.5663 27.7401 36.798 27.8858 36.9381C28.0315 37.0782 28.2632 37.0737 28.4033 36.928C28.727 36.5914 29.0501 36.2455 29.3728 35.8898C29.5087 35.7401 29.4974 35.5087 29.3477 35.3728ZM26.9076 37.9103C26.7686 37.7636 26.5369 37.7575 26.3902 37.8966C26.0473 38.2217 25.7037 38.5369 25.3595 38.8426C25.2083 38.9768 25.1946 39.2082 25.3288 39.3593C25.463 39.5105 25.6943 39.5242 25.8455 39.39C26.1958 39.079 26.5452 38.7584 26.8939 38.4278C27.0406 38.2887 27.0467 38.057 26.9076 37.9103ZM24.2713 40.2513C24.145 40.0934 23.9147 40.0678 23.7568 40.1941C23.3896 40.4878 23.0214 40.7717 22.6519 41.0465C22.4897 41.1671 22.4559 41.3964 22.5766 41.5586C22.6972 41.7208 22.9265 41.7545 23.0887 41.6339C23.4651 41.3541 23.8402 41.0649 24.2141 40.7658C24.372 40.6395 24.3976 40.4092 24.2713 40.2513ZM21.4441 42.3542C21.3324 42.1858 21.1052 42.1397 20.9367 42.2514C20.5461 42.5105 20.1537 42.7604 19.7595 43.002C19.5872 43.1076 19.5331 43.3329 19.6387 43.5053C19.7443 43.6777 19.9696 43.7318 20.142 43.6262C20.5435 43.3801 20.9432 43.1255 21.3413 42.8616C21.5098 42.7499 21.5558 42.5227 21.4441 42.3542ZM18.4409 44.1965C18.3444 44.0189 18.1222 43.9531 17.9445 44.0496C17.5337 44.2727 17.1207 44.4881 16.7051 44.6963C16.5244 44.7869 16.4513 45.0068 16.5419 45.1875C16.6325 45.3683 16.8524 45.4414 17.0331 45.3508C17.4557 45.139 17.8759 44.92 18.294 44.6929C18.4716 44.5964 18.5374 44.3741 18.4409 44.1965ZM15.2915 45.7777C15.2093 45.593 14.9929 45.5099 14.8082 45.592C14.3823 45.7815 13.9535 45.9649 13.5216 46.1429C13.3347 46.22 13.2457 46.4339 13.3227 46.6208C13.3997 46.8077 13.6137 46.8968 13.8006 46.8198C14.2384 46.6393 14.6734 46.4533 15.1058 46.2609C15.2905 46.1787 15.3736 45.9624 15.2915 45.7777ZM12.0346 47.1234C11.9644 46.9338 11.7538 46.837 11.5642 46.9072C11.1276 47.0689 10.6876 47.2263 10.2443 47.3801C10.0533 47.4464 9.95217 47.6549 10.0184 47.8459C10.0847 48.0369 10.2932 48.138 10.4842 48.0717C10.932 47.9163 11.3767 47.7572 11.8184 47.5937C12.008 47.5235 12.1048 47.3129 12.0346 47.1234ZM8.70618 48.2814C8.64478 48.0888 8.43887 47.9824 8.24626 48.0438C7.80269 48.1852 7.35555 48.3242 6.90465 48.4614C6.71125 48.5202 6.60217 48.7247 6.661 48.9181C6.71985 49.1115 6.92432 49.2206 7.11773 49.1617C7.5714 49.0237 8.02164 48.8838 8.46861 48.7413C8.66121 48.6799 8.76758 48.474 8.70618 48.2814ZM5.33512 49.3097C5.27912 49.1155 5.07627 49.0034 4.88203 49.0594C4.43451 49.1884 3.98326 49.3166 3.52809 49.4446C3.33348 49.4994 3.22009 49.7015 3.27481 49.8961C3.32954 50.0907 3.53166 50.2041 3.72626 50.1494C4.18267 50.021 4.63547 49.8924 5.0848 49.7628C5.27904 49.7068 5.39111 49.504 5.33512 49.3097ZM1.94268 50.2659C1.889 50.071 1.68748 49.9566 1.49259 50.0103C1.26639 50.0726 1.03923 50.135 0.811072 50.1977C0.616146 50.2513 0.501538 50.4527 0.555094 50.6476C0.608649 50.8426 0.810088 50.9572 1.00501 50.9036C1.23326 50.8409 1.4606 50.7784 1.68701 50.716C1.88191 50.6623 1.99637 50.4608 1.94268 50.2659Z"
        fill="white"
      />
    </svg>
  );
}

CurvedDottedLine.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 43 / 51,
  svg: CurvedDottedLine,
  title,
};
