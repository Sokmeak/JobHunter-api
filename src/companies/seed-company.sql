-- Ensure EMPLOYER role exists
INSERT INTO public.roles (id, name, "createdAt", "updatedAt", "deletedAt")
VALUES (3, 'EMPLOYER', NOW(), NOW(), NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert users and companies

DO $$
DECLARE
    user_id integer;
    
BEGIN
    -- TechCorp
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin@gmail.com',
        'hashed_password_0', -- Placeholder for bcrypt hash
        'techcorp_admin',
        3, -- EMPLOYER role
        NULL, -- companyId set later
        NOW(),
        NOW(),
        NULL
    )

    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'TechCorp',
        '100',
        '',
        'https://techcorp.com',
        'techcorp_admin',
        'admin@gmail.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Nomad
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin1@nomadlist.com',
        'hashed_password_1',
        'nomad_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Nomad',
        '1-10',
        '',
        'https://nomadlist.com',
        'nomad_admin',
        'admin1@nomadlist.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Dropbox
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin2@dropbox.com',
        'hashed_password_2',
        'dropbox_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Dropbox',
        '501+',
        '',
        'https://dropbox.com',
        'dropbox_admin',
        'admin2@dropbox.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- CryptoFlow
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin3@cryptoflow.com',
        'hashed_password_3',
        'cryptoflow_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'CryptoFlow',
        '201-500',
        '',
        'https://cryptoflow.com',
        'cryptoflow_admin',
        'admin3@cryptoflow.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Terraform
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin4@terraform.io',
        'hashed_password_4',
        'terraform_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Terraform',
        '51-200',
        '',
        'https://terraform.io',
        'terraform_admin',
        'admin4@terraform.io',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Revolut
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin5@revolut.com',
        'hashed_password_5',
        'revolut_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Revolut',
        '201-500',
        '',
        'https://revolut.com',
        'revolut_admin',
        'admin5@revolut.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Canva
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin6@canva.com',
        'hashed_password_6',
        'canva_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Canva',
        '501+',
        '',
        'https://canva.com',
        'canva_admin',
        'admin6@canva.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- ClassPass
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin7@classpass.com',
        'hashed_password_7',
        'classpass_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'ClassPass',
        '51-200',
        '',
        'https://classpass.com',
        'classpass_admin',
        'admin7@classpass.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Pitch
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin8@pitch.com',
        'hashed_password_8',
        'pitch_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Pitch',
        '11-50',
        '',
        'https://pitch.com',
        'pitch_admin',
        'admin8@pitch.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Figma
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin9@figma.com',
        'hashed_password_9',
        'figma_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Figma',
        '201-500',
        '',
        'https://figma.com',
        'figma_admin',
        'admin9@figma.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Vercel
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin10@vercel.com',
        'hashed_password_10',
        'vercel_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Vercel',
        '51-200',
        '',
        'https://vercel.com',
        'vercel_admin',
        'admin10@vercel.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Notion
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin11@notion.so',
        'hashed_password_11',
        'notion_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Notion',
        '201-500',
        '',
        'https://notion.so',
        'notion_admin',
        'admin11@notion.so',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- GitLab
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin12@gitlab.com',
        'hashed_password_12',
        'gitlab_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'GitLab',
        '501+',
        '',
        'https://gitlab.com',
        'gitlab_admin',
        'admin12@gitlab.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Buffer
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin13@buffer.com',
        'hashed_password_13',
        'buffer_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Buffer',
        '11-50',
        '',
        'https://buffer.com',
        'buffer_admin',
        'admin13@buffer.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Trello
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin14@trello.com',
        'hashed_password_14',
        'trello_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Trello',
        '51-200',
        '',
        'https://trello.com',
        'trello_admin',
        'admin14@trello.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Zapier
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin15@zapier.com',
        'hashed_password_15',
        'zapier_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Zapier',
        '201-500',
        '',
        'https://zapier.com',
        'zapier_admin',
        'admin15@zapier.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Slack
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin16@slack.com',
        'hashed_password_16',
        'slack_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Slack',
        '501+',
        '',
        'https://slack.com',
        'slack_admin',
        'admin16@slack.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Klarna
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin17@klarna.com',
        'hashed_password_17',
        'klarna_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Klarna',
        '501+',
        '',
        'https://klarna.com',
        'klarna_admin',
        'admin17@klarna.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Adobe
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin18@adobe.com',
        'hashed_password_18',
        'adobe_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Adobe',
        '501+',
        '',
        'https://adobe.com',
        'adobe_admin',
        'admin18@adobe.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- LinkedIn
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin19@linkedin.com',
        'hashed_password_19',
        'linkedin_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'LinkedIn',
        '501+',
        '',
        'https://linkedin.com',
        'linkedin_admin',
        'admin19@linkedin.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Spotify
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin20@spotify.com',
        'hashed_password_20',
        'spotify_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Spotify',
        '501+',
        '',
        'https://spotify.com',
        'spotify_admin',
        'admin20@spotify.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- DeepMind
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin21@deepmind.com',
        'hashed_password_21',
        'deepmind_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'DeepMind',
        '201-500',
        '',
        'https://deepmind.com',
        'deepmind_admin',
        'admin21@deepmind.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Webflow
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin22@webflow.com',
        'hashed_password_22',
        'webflow_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Webflow',
        '51-200',
        '',
        'https://webflow.com',
        'webflow_admin',
        'admin22@webflow.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Shopify
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin23@shopify.com',
        'hashed_password_23',
        'shopify_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Shopify',
        '501+',
        '',
        'https://shopify.com',
        'shopify_admin',
        'admin23@shopify.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Dribbble
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin24@dribbble.com',
        'hashed_password_24',
        'dribbble_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Dribbble',
        '51-200',
        '',
        'https://dribbble.com',
        'dribbble_admin',
        'admin24@dribbble.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Behance
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin25@behance.net',
        'hashed_password_25',
        'behance_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Behance',
        '201-500',
        '',
        'https://behance.net',
        'behance_admin',
        'admin25@behance.net',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;

    -- Twitter
    INSERT INTO public.users (id, email, password, username, "roleId", "companyId", "createdAt", "updatedAt", "deletedAt")
    VALUES (
        nextval('users_id_seq'),
        'admin26@twitter.com',
        'hashed_password_26',
        'twitter_admin',
        3,
        NULL,
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO user_id;

    INSERT INTO public.companies (
        id, "userId", name, employee_count, email, website_url, hr_contact_name, hr_contact_email,
        founded_date, industry, office_location, twitter_url, facebook_url, linked_url,
        headquarters_location, "isActive", "isVerified", brand_logo, "createdAt", "updatedAt", "deletedAt"
    )
    VALUES (
        nextval('companies_id_seq'),
        user_id,
        'Twitter',
        '501+',
        '',
        'https://twitter.com',
        'twitter_admin',
        'admin26@twitter.com',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        true,
        false,
        '',
        NOW(),
        NOW(),
        NULL
    )
    RETURNING id INTO company_id;

    UPDATE public.users SET "companyId" = company_id WHERE id = user_id;
END $$;